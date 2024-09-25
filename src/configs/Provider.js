import axios from 'axios';

const BASE_URL = 'https://apiforcornershost.cubisysit.com/api/';

class Provider {

    getData(endPoint, params) {
        if (params) {
            return axios.get(`${BASE_URL}${endPoint}`, params);
        }
        else {
            return axios.get(`${BASE_URL}${endPoint}`);
        }
    }

    postData(endPoint, params) {
        return axios.post(`${BASE_URL}${endPoint}`, params);
        // if (params) {
        //     return axios.post(`${BASE_URL}${endPoint}`, params, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //         }
        //     });
        // }
        
    }

    //#region Old API's
    // getAll(resource) {
    //   return axios.get(`${BASE_URL}/${resource}`, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //     },
    //   });
    // }
    // getAllParams(resource, params) {
    //   return axios.get(
    //     `${BASE_URL_OLD}/${resource}`,
    //     { body: params },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //       },
    //     },
    //   );
    // }
    // get(resource, id) {
    //   return axios.get < `${BASE_URL_OLD}/${resource}/${id}`;
    // }
    // create(resource, params) {
    //   return axios.post(`${BASE_URL_OLD}/${resource}`, params, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //     },
    //   });
    // }
    // update(resource, params, id) {
    //   return axios.put(`${BASE_URL_OLD}/${resource}/${id}`, params, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //     },
    //   });
    // }
    // delete(resource, id) {
    //   return axios.delete(`${BASE_URL_OLD}/${resource}/${id}`, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //     },
    //   });
    // }
    // deleteAll(resource) {
    //   return axios.delete(`${BASE_URL_OLD}/${resource}`, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //     },
    //   });
    // }
    // deleteAllParams(resource, params) {
    //   return axios.delete(`${BASE_URL_OLD}/${resource}`, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       XApiKey: 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
    //     },
    //     data: params,
    //   });
    // }
    //#endregion

    //#region New API's

    API_URLS = {
        /******************************LOGIN************************************/
        apilogin: 'api-login.php',
        //UserFromRefNo: 'userrefnocheck/',

        /******************************SIGN UP************************************/
        NewUserProfile: 'newuserprofilecreate/',

    };

    // createDFPocketDairy(resource, params) {
    //   return axios.post(`${BASE_URL_PocketDiary}/${resource}`, params);
    // }
    // createDFClient(resource, params) {
    //   return axios.post(`${BASE_URL_CLIENT}/${resource}`, params);
    // }
    // createDFPocketDairyWithHeader(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_PocketDiary}/${resource}`, params, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL_PocketDiary}/${resource}`, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   }
    // }

    // createDFDealerWithHeader(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Dealer}/${resource}`, params, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL_Dealer}/${resource}`, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   }
    // }

    // createDFCommon(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL}/${resource}`, params);
    //   }
    //   else {
    //     return axios.post(`${BASE_URL}/${resource}`);
    //   }

    // }
    // createDFManufacturer(resource, params) {
    //   return axios.post(`${BASE_URL_Manufacturer}/${resource}`, params);
    // }
    // convert(params, isImageReplaced, filePath) {
    //   const datas = new FormData();

    //   datas.append('data', JSON.stringify(params));
    //   datas.append(
    //     'profile_photo',
    //     isImageReplaced
    //       ? filePath != null &&
    //         filePath != undefined &&
    //         filePath.type != undefined &&
    //         filePath.type != null
    //         ? {
    //           name: 'appimage1212.jpg',
    //           type: filePath.type || filePath.mimeType,
    //           uri: filePath.uri,
    //         }
    //         : ''
    //       : '',
    //   );
    //   console.log('###########NEW DATA:', datas, '###########');
    //   return datas;
    // }
    // async updateEmployee(
    //   basic,
    //   work,
    //   pay,
    //   isImageReplaced,
    //   filePath,
    //   logoImage,
    //   unload,
    // ) {
    //   console.log('*************BASE_URL', BASE_URL, '*************');
    //   console.log('****** basic data:', basic, '********************');
    //   try {
    //     console.log('step 001');
    //     const empbasicdata = await axios.post(
    //       `${BASE_URL}/employeebasicdataupdate/`,
    //       this.convert(basic, isImageReplaced, filePath),
    //       {
    //         headers: { 'Content-Type': 'multipart/form-data' },
    //       },
    //     );
    //     console.log('step 002');
    //     const workData = await axios.post(`${BASE_URL}/employeeworkdataupdate/`, {
    //       data: work,
    //     });
    //     console.log('step 003');
    //     const payDetails = await axios.post(
    //       `${BASE_URL}/employeepaydataupdate/`,
    //       { data: pay },
    //     );

    //     console.log('HAHAHA.....empbasicdata:', empbasicdata.data);
    //     console.log('HAHAHA.....workData:', workData.data);
    //     console.log('HAHAHA.....payDetails:', payDetails.data);
    //     return {
    //       sucess:
    //         empbasicdata.data.status === 'Success' &&
    //         workData.data.status === 'Success' &&
    //         payDetails.data.status === 'Success',
    //     };
    //   } catch (e) {
    //     console.log('step 11');
    //     console.log(e);
    //     unload();
    //   }
    // }

    // async getEmployeebasicDetails(params, unload) {
    //   try {
    //     const empdata = await axios.post(
    //       `${BASE_URL}/getemployeepaydata/`,
    //       params,
    //     );
    //     const empbasicdata = await axios.post(
    //       `${BASE_URL}/getemployeebasicdata/`,
    //       params,
    //     );
    //     const workdata = await axios.post(
    //       `${BASE_URL}/getemployeeworkdata/`,
    //       params,
    //     );
    //     const payDetails = await axios.post(
    //       `${BASE_URL}/getemployeepaydata/`,
    //       params,
    //     );
    //     const reportingDetails = await axios.post(
    //       `${BASE_URL}/getreportingtoemployeeworkform/`,
    //       params,
    //     );
    //     return {
    //       empbasicdata: empbasicdata.data.data,
    //       workdata: workdata.data.data,
    //       payDetails: payDetails.data.data,
    //       reportingDetails: reportingDetails.data.data,
    //       empdata: empdata.data.data,
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     unload();
    //   }
    // }

    // async MarkAvailabilityDetails(params, params2, unload) {
    //   try {
    //     const empdata = await axios.post(
    //       `${BASE_URL}/${this.API_URLS.branchadmin_getemployeelist_markavailability}/`,
    //       params,
    //     );
    //     const empAvailabilityData = await axios.post(
    //       `${BASE_URL}/${this.API_URLS.branchadmin_getemployee_availability_edit}/`,
    //       params2,
    //     );
    //     return {
    //       empAvailabilityData: empAvailabilityData.data.data,
    //       empdata: empdata.data.data,
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     unload();
    //   }
    // }

    // async MarkAttendanceDetails(params, params2, unload) {
    //   try {
    //     const empdata = await axios.post(
    //       `${BASE_URL}/${this.API_URLS.branchadmin_getemployeelist_attendance}/`,
    //       params,
    //     );
    //     const empAttendanceData = await axios.post(
    //       `${BASE_URL}/${this.API_URLS.branchadmin_getemployee_attendance_edit}/`,
    //       params2,
    //     );
    //     return {
    //       empAttendanceData: empAttendanceData.data.data,
    //       empdata: empdata.data.data,
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     unload();
    //   }
    // }

    // async getEmployeebasicDetailsWithoutReporting(params, unload) {
    //   try {
    //     const empdata = await axios.post(
    //       `${BASE_URL}/getemployeepaydata/`,
    //       params,
    //     );
    //     const empbasicdata = await axios.post(
    //       `${BASE_URL}/getemployeebasicdata/`,
    //       params,
    //     );
    //     const workdata = await axios.post(
    //       `${BASE_URL}/getemployeeworkdata/`,
    //       params,
    //     );
    //     const payDetails = await axios.post(
    //       `${BASE_URL}/getemployeepaydata/`,
    //       params,
    //     );
    //     return {
    //       empbasicdata: empbasicdata.data.data,
    //       workdata: workdata.data.data,
    //       payDetails: payDetails.data.data,
    //       empdata: empdata.data.data,
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     unload();
    //   }
    // }

    // async getEnquiriesList(params, unload) {
    //   try {
    //     const newEnq = await axios.post(
    //       `${BASE_URL_Contractor}/appuser_new_enquiry_list/`,
    //       params,
    //     );
    //     const acceptedEnq = await axios.post(
    //       `${BASE_URL_Contractor}/appuser_accepted_enquiry_list/`,
    //       params,
    //     );
    //     const rejectedEnq = await axios.post(
    //       `${BASE_URL_Contractor}/appuser_rejected_enquiry_list/`,
    //       params,
    //     );
    //     return {
    //       newEnq: newEnq.data.data ? newEnq.data.data : [],
    //       acceptedEnq: acceptedEnq.data.data ? acceptedEnq.data.data : [],
    //       rejectedEnq: rejectedEnq.data.data ? rejectedEnq.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getConsultantBOQList(params, unload) {
    //   try {
    //     const newBoq = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_newboq_list/`,
    //       params,
    //     );
    //     const approvedBoq = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_accepted_list/`,
    //       params,
    //     );
    //     const rejectedBoq = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_rejected_list/`,
    //       params,
    //     );
    //     return {
    //       newBoq: newBoq?.data?.data ? newBoq?.data?.data : [],
    //       approvedBoq: approvedBoq?.data?.data ? approvedBoq?.data?.data : [],
    //       rejectedBoq: rejectedBoq?.data?.data ? rejectedBoq?.data?.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }
    // async contractorBoqEdit(params, unload) {
    //   try {
    //     const { data } = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_boq_edit_data/`,
    //       params,
    //     );
    //     return data;
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async approveContractorBoq(params, unload) {
    //   try {
    //     console.log(params);
    //     const { data } = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_boq_approve/`,
    //       params,
    //     );
    //     return data;
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async rejectContractorBoq(params, unload) {
    //   try {
    //     const { data } = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_boq_reject/`,
    //       params,
    //     );
    //     return data;
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getdropdowndata(params, unload) {
    //   try {
    //     const clients = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_get_clientname_quotationform/`,
    //       params,
    //     );
    //     const states = await axios.post(`${BASE_URL}/getstatedetails/`, params);
    //     const units = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_get_unitofsales_quotationform/`,
    //       params,
    //     );
    //     const services = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_getservicename_popup_quotationform/`,
    //       params,
    //     );

    //     return {
    //       clients: clients.data.data ? clients.data.data : [],
    //       states: states.data.data ? states.data.data : [],
    //       units: units.data.data ? units.data.data : [],
    //       services: services.data.data ? services.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getdropdownratecarddata(params, unload) {
    //   try {
    //     const clients = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_get_clientname_sendratecardform/`,
    //       params,
    //     );
    //     const states = await axios.post(`${BASE_URL}/getstatedetails/`, params);
    //     const units = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_get_unitofsales_sendratecardform/`,
    //       params,
    //     );
    //     const services = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_getservicename_popup_sendratecardform/`,
    //       params,
    //     );

    //     return {
    //       clients: clients.data.data ? clients.data.data : [],
    //       states: states.data.data ? states.data.data : [],
    //       units: units.data.data ? units.data.data : [],
    //       services: services.data.data ? services.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getmyestimation(params, unload) {
    //   try {
    //     const newEnq = await axios.post(
    //       `${BASE_URL_CLIENT}/client_mydesign_estimation_pendinglist/`,
    //       params,
    //     );
    //     const acceptedEnq = await axios.post(
    //       `${BASE_URL_CLIENT}/client_mydesign_estimation_approvedlist/`,
    //       params,
    //     );
    //     const rejectedEnq = await axios.post(
    //       `${BASE_URL_CLIENT}/client_mydesign_estimation_rejectedlist/`,
    //       params,
    //     );

    //     return {
    //       newEnq: newEnq.data.data ? newEnq.data.data : [],
    //       acceptedEnq: acceptedEnq.data.data ? acceptedEnq.data.data : [],
    //       rejectedEnq: rejectedEnq.data.data ? rejectedEnq.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async clientBoqConfirmWorkOrderPopupApprove(params) {
    //   try {
    //     const { data } = await axios.post(
    //       `${BASE_URL_CLIENT}/client_boq_confirmworkorder_popup_approve/`,
    //       params,
    //     );

    //     return data;
    //   } catch (e) {
    //     console.log(e?.message);
    //     return;
    //   }
    // }

    // async clientBoqConfirmWorkOrderPopupReject(params) {
    //   try {
    //     const { data } = await axios.post(
    //       `${BASE_URL_CLIENT}/client_boq_confirmworkorder_popup_reject/`,
    //       params,
    //     );

    //     return data;
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getmyquotation(params, unload) {
    //   try {
    //     const newEnq = await axios.post(
    //       `${BASE_URL_CLIENT}/client_quotation_pendinglist/`,
    //       params,
    //     );
    //     const acceptedEnq = await axios.post(
    //       `${BASE_URL_CLIENT}/client_quotation_approvedlist/`,
    //       params,
    //     );
    //     const rejectedEnq = await axios.post(
    //       `${BASE_URL_CLIENT}/client_quotation_rejectedlist/`,
    //       params,
    //     );

    //     return {
    //       newEnq: newEnq.data.data ? newEnq.data.data : [],
    //       acceptedEnq: acceptedEnq.data.data ? acceptedEnq.data.data : [],
    //       rejectedEnq: rejectedEnq.data.data ? rejectedEnq.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getcontractordesignwise(params, unload) {
    //   try {
    //     const gallery = await axios.post(
    //       `${BASE_URL_Contractor}/contractor_get_servicewise_design/`,
    //       params,
    //     );
    //     // const pending = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_scdesign_estimation_pending_list/`,
    //     //   params
    //     // );
    //     // const accepted = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_scdesign_estimation_approved_list/`,
    //     //   params
    //     // );
    //     // const rejected = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_scdesign_estimation_rejected_list/`,
    //     //   params
    //     // );
    //     const response = await axios.post(
    //       `${BASE_URL_Contractor}/get_clientresponsetypelist/`,
    //       params,
    //     );
    //     return {
    //       gallery: gallery.data.data ? gallery.data.data : [],
    //       response: response.data.data ? response.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getcontractorquotationwise(params, unload) {
    //   try {
    //     // const approvedPending = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_quotation_approved_pendng_list/`,
    //     //   params,
    //     // );
    //     // const sendPending = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_quotation_send_pendng_list/`,
    //     //   params,
    //     // );
    //     // const approved = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_quotation_approved_list/`,
    //     //   params,
    //     // );
    //     // const rejected = await axios.post(
    //     //   `${BASE_URL_Contractor}/contractor_quotation_rejected_list/`,
    //     //   params,
    //     // );
    //     const response = await axios.post(
    //       `${BASE_URL_Contractor}/get_clientresponsetypelist/`,
    //       params,
    //     );
    //     return {
    //       response: response.data.data ? response.data.data : [],
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     return;
    //   }
    // }

    // async getpurchaseorderlist(params, unload, error) {
    //   try {
    //     const orderdata = await axios.post(
    //       `${BASE_URL_Manufacturer}/mfporefnocheck/`,
    //       params,
    //     );
    //     const vendordata = await axios.post(
    //       `${BASE_URL_Manufacturer}/get_vendorcompanyname_manufacturer_poform/`,
    //       params,
    //     );
    //     const supplierdata = await axios.post(
    //       `${BASE_URL_Manufacturer}/get_suppliername_manufacturer_poform/`,
    //       params,
    //     );
    //     unload();
    //     return {
    //       order: orderdata.data.data,
    //       vendor: vendordata.data.data,
    //       supplier: supplierdata.data.data,
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     error();
    //     unload();
    //   }
    // }

    // async acceptAndSendBoq(params, unload) {
    //   try {
    //     const { data } = await axios.post(
    //       `${BASE_}/apiarchitect/spawu7S4urax/tYjD/architect_boq_accept_and_sendtoclientapproval/`,
    //       params,
    //     );
    //     unload();
    //     return {
    //       data,
    //     };
    //   } catch (e) {
    //     console.log(e);
    //     unload();
    //   }
    // }

    // async clientBoqView(params) {
    //   try {
    //     const { data } = await axios.post(
    //       `${BASE_}/apiclient/spawu7S4urax/tYjD/client_boq_view/
    //       `,
    //       params,
    //     );

    //     return data;
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    // async getbrandvalueconversion(params, unload) {
    //   try {
    //     const servicename = await axios.post(
    //       `${BASE_}/apimanufacturer/spawu7S4urax/tYjD/getservicenamebrandconversionform/`,
    //       params,
    //     );
    //     unload();
    //     return servicename.data.data;
    //   } catch (e) {
    //     console.log(e);
    //     unload();
    //   }
    // }
    // createDFCommonWithouParam(resource) {
    //   return axios.post(`${BASE_URL}/${resource}`);
    // }

    // createDFCommonWithHeader(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL}/${resource}`, params, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL}/${resource}`, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   }
    // }

    // createDFAdmin(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Admin}/${resource}`, params);
    //   } else {
    //     return axios.post(`${BASE_URL_Admin}/${resource}`);
    //   }
    // }

    // createDFArchitect(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Architect}/${resource}`, params);
    //   } else {
    //     return axios.post(`${BASE_URL_Architect}/${resource}`);
    //   }
    // }

    // createDFEmployee(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Employee}/${resource}`, params);
    //   } else {
    //     return axios.post(`${BASE_URL_Employee}/${resource}`);
    //   }
    // }

    // createDFEmployeeWithHeader(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Employee}/${resource}`, params, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL_Employee}/${resource}`, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   }
    // }

    // createDFArchitectWithHeader(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Architect}/${resource}`, params, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL_Architect}/${resource}`, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   }
    // }

    // createDFContractor(resource, params) {
    //   console.log(`${BASE_URL_Contractor}/${resource}`);
    //   return axios.post(`${BASE_URL_Contractor}/${resource}`, params);
    // }
    // createDFSupervisor(resource, params) {
    //   console.log(`${BASE_URL_Supervisor}/${resource}`);
    //   return axios.post(`${BASE_URL_Supervisor}/${resource}`, params);
    // }

    // createDFAdminWithHeader(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Admin}/${resource}`, params, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL_Admin}/${resource}`, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //   }
    // }

    // createDFDashboard(resource, params = null) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_Dashboard}/${resource}`, params, {
    //       timeout: timeoutLimit,
    //     });
    //   } else {
    //     return axios.post(`${BASE_URL_Dashboard}/${resource}`, {
    //       timeout: timeoutLimit,
    //     });
    //   }
    // }
    // checkServerActive() {
    //   // axios.get(onePixelImage)
    //   //   .then(response => {
    //   //     console.log(response);
    //   //     if (response.status >= 200 && response.status < 300) {
    //   //       console.log('Image is available on server');
    //   //     } else {
    //   //       console.log('Image is not available on server');
    //   //     }
    //   //   })
    //   //   .catch(error => {
    //   //     console.log('Error checking image availability', error);
    //   //   });
    //   axios
    //     .get(onePixelImage, { timeout: timeoutLimit })
    //     .then(response => {
    //       // Handle successful response
    //     })
    //     .catch(error => {
    //       if (error.code === 'ECONNABORTED') {
    //         console.log('Request timed out');
    //       } else {
    //         console.log('Error occurred', error);
    //       }
    //     });
    // }

    // createDFAPI(resource, params) {
    //   if (params) {
    //     return axios.post(`${BASE_URL_API}/${resource}`, params);
    //   } else {
    //     return axios.post(`${BASE_URL_API}/${resource}`);
    //   }
    // }

    // createDFDealer(resource, params) {
    //   return axios.post(`${BASE_URL_Dealer}/${resource}`, params, {
    //     timeout: timeoutLimit,
    //     maxContentLength: 100000000,
    //     maxBodyLength: 1000000000,
    //   });
    // }

    //#endregion
}
export default new Provider();