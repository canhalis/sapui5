sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";
	var gvSelectedCbox;

	return BaseController.extend("zficari.zficari.controller.Worklist", {

		formatter: formatter,

		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "myModel");

			this.oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.oView));
			this.oModel = this.oComponent.getModel();

			var oRecord = {
				Lifnr: "",
				Name1: "",
				// Erdat: "",
				// Ernam: "",
				Statu: ""
			};
			this.getModel("myModel").setProperty("/newRecord", oRecord);
		},
		onNewRecord: function () {
			if (!this.diaFrag) {
				this.diaFrag = sap.ui.xmlfragment("zficari.zficari.view.fragment.newRecord", this);
				this.getView().addDependent(this.diaFrag);
			}
			this.diaFrag.open();
		},
		onDialogSave: function () {
			var oNewRecord = this.getView().getModel("myModel").getProperty("/newRecord");
			oNewRecord.Statu = gvSelectedCbox;

			if ((typeof oNewRecord.Lifnr === undefined || oNewRecord.Lifnr.trim() === "")) {
				MessageToast.show("Satıcı zorunlu alandır.");
			} else if (!oNewRecord.Lifnr.match("^[0-9]+$")) {
				MessageToast.show("Satıcı alanına sadece sayı yazılabilir.");
			} else if (oNewRecord.Lifnr.length > 10) {
				MessageToast.show("Satıcı alanı max 10 karakter olabilir.");
			} else if (!gvSelectedCbox) {
				MessageToast.show("Durumu seçiniz.");
			} else {
				var that = this;
				this.oModel.create("/mainSet", oNewRecord, {
					success: function (resp) {
						MessageToast.show("Başarılı");
						that.onCancel();
					},
					error: function (err) {
						MessageToast.show("Başarısız Oldu.");
						that.onCancel();
					}
				});
			}
		},
		onHandleCombobox: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource();
			gvSelectedCbox = oValidatedComboBox.getSelectedKey();
			var lValue = oValidatedComboBox.getValue();

			if (!gvSelectedCbox && lValue) {
				oValidatedComboBox.setValueState("Error");
				oValidatedComboBox.setValueStateText("Geçerli durum bilgisi giriniz.");
			} else {
				oValidatedComboBox.setValueState("None");
			}
		},
		onCancel: function () {
			if (this.diaFrag)
				this.diaFrag.close();
		}

	});
});