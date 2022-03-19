import { Component, ElementRef, Input, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AfiyeImageCropperPickerComponent } from './image-cropper/image.cropper.component';
import { ToastrService } from 'ngx-toastr';

import imageCompression from 'browser-image-compression';

@Component({
	selector: 'afiye-file-picker',
	templateUrl: './file.component.html',
	styleUrls: ['./file.component.scss']
})
export class AfiyeFilePickerComponent implements OnDestroy 
{
	@Input() showImage: boolean;
	@Input() pickerID: string;
	@Input() image: string;
	@Input() label: string;
	@Input() defaultImg: string;
	@Input() maxFileSize: number;  								// Provide size in MBs i.e 5
	@Input() allowMultiple: boolean;
	@Input() allowedFileTypes: string[];
	@Input() allowImageCroping: boolean;
	@Input() showIcon: boolean = false;

	progressValue: number;

	private _unsubscribeAll: Subject<any>;
	private currentUploadRequest: Subscription;

	@Output() change: EventEmitter<any>;
	@ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

	constructor(
		private toastr: ToastrService,
		private modalService: NgbModal
	) {
		this.image = null;
		this.label = null;
		this.maxFileSize = 1;
		this.progressValue = 0;
		this.allowMultiple = true;
		this.allowImageCroping = false;
		this.showImage = false;
		this.pickerID = 'ficker_id';
		this.allowedFileTypes = ['.jpg', '.png', '.jpeg', '.gif'];
		this.defaultImg = 'assets/images/profile_details_icon.svg';

		this.change = new EventEmitter();
		this._unsubscribeAll = new Subject();
		this.currentUploadRequest = new Subscription();
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();

		if (this.currentUploadRequest) {
			this.currentUploadRequest.unsubscribe();
			this.currentUploadRequest = null;
		}
	}

	onChooseImage(): void {
		// this.fileInput.nativeElement.click();
		const el: any = document.getElementById(this.pickerID);
		console.log('el => ', el.value)
		el.value = null;
		el.click();
	}

	async onFileChange() {
		this.progressValue = 0;
		const fileList: FileList = this.fileInput.nativeElement.files;
		const files: FileList | undefined[] = fileList.length > 0 ? fileList : [];
		console.log('file chec => ', files)

		if (files && files.length) {

			let isValid = true;
			for(let i=0; i<files.length; i++) {
				if (!this.isValidFileType(files[i])) {
					isValid = false;
				}
			}
			
			if (!isValid) {
				this.toastr.error(`Invalid File Type. Allowed types are ${this.allowedFileTypes}`, '');
				return;
			}

			if (this.allowImageCroping) {
				const file = files[0];
				await this.onCropImage(file);
			}

			else {
				await this.onUploadFile(files as any[], null, true);
			}
		}
	}

	async onCropImage(file: any) {
		const modRef = this.modalService.open(AfiyeImageCropperPickerComponent,
		{
			centered: true,
			backdrop: 'static',
			keyboard: false,
			windowClass: 'app-image-cropper-modal'
		});

		modRef.componentInstance.fileEvent = file;
		modRef.componentInstance.type = file.type;
		modRef.componentInstance.change.subscribe(async (croppedFile: any) => {
			if (croppedFile) {
				await this.onUploadFile([croppedFile], file.name);
			}
		});
	}

	async onUploadFile(files: any[], fileName: string = null, getName = false) 
	{
		console.log('Start => ', files)

		let uFiles = [];
		for (let f of files) {
			uFiles.push(f);
		}

		console.log('Start after => ', uFiles)

		const promises = await uFiles.map(async file => {
			console.log('originalFile instanceof Blob', file instanceof Blob); // true
			console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

			const options = {
				maxSizeMB: this.maxFileSize,
				maxWidthOrHeight: 1920,
				useWebWorker: true
			}
			try {
				const compressedFile = await imageCompression(file, options);
				console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
				console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

				// uploadingFiles.push({file: compressedFile, fileName: fileName})
				// this.change.emit({file: compressedFile, fileName: fileName});
				if (getName) {
					fileName = file.name;
				}
				return {file: compressedFile, fileName: fileName};

			} catch (error) {
				console.log(error);
			}
		});


		const uploadingFiles = await Promise.all(promises);
		console.log('End => ', uploadingFiles);
		this.change.emit({files: uploadingFiles});

		// console.log('onupload method')
		// const formData: FormData = new FormData();
		// formData.append('logoPath', file, fileName);
		
		// this.change.emit({file: file, fileName: fileName});
	}

	isValidFileType(file: File): boolean {
		if (this.allowedFileTypes.length > 0) {
			return (new RegExp('(' + this.allowedFileTypes.join('|').replace(/\./g, '\\.') + ')$')).test(file.name.toLowerCase());
		}

		return true;
	}

	onImgError(ev: any)
	{
		ev.target.src = this.defaultImg;
	}

	get img(): string {
		return this.image ?? this.defaultImg;
	}
}
