import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss'],
  providers: [DialogService]
})
export class WorkflowSimulatorComponent implements OnInit {


  constructor(
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public appUtilBaseService: AppUtilBaseService,
    public messageService: MessageService,
  ) { }

  statusFieldConfig: any;
  actorFieldConfig: any;
  detailFormControls = new FormGroup({
    actor: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {
    this.statusFieldConfig = this.dynamicDialogConfig.data?.statusFieldConfig;
    this.actorFieldConfig = this.dynamicDialogConfig.data?.actorFieldConfig;

    const selectedActors: any = [];
    if (this.dynamicDialogConfig.data?.selectedValues?.userTypes?.length) {
      this.dynamicDialogConfig.data?.selectedValues.userTypes?.map((actor: string) => { selectedActors.push( { label: actor, value: actor }) })
      this.detailFormControls.get('actor')?.patchValue(selectedActors);
      this.detailFormControls.get('status')?.patchValue(this.dynamicDialogConfig.data?.selectedValues.step?.toUpperCase());
    }
  }

  loadWorkflow() {
    const values = this.detailFormControls.getRawValue();
    const finalArr: string[] = [];
    const formErrors = {};
    const inValidFields = {};
    let actors: any = [];

    if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, formErrors, finalArr, inValidFields)) {
      if (finalArr.length) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: '', detail: finalArr.join(), sticky: true });
      }
    } else {
      values.actor?.map((actor: any) => {
        actors.push(actor.label);
      })
      this.dynamicDialogRef.close({
        userTypes: actors,
        step: values.status?.toLowerCase()
      });
    }

  }
  getSelectedObject(field: string, options: any) {
    if (options) {
      const selectedObj = (options.filter((item: { label: any }) => item.label.includes(field)));
      return selectedObj[0];

    }
  }

  log(data: any) {
    console.log(data)
  }

}
