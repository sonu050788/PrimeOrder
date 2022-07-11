var USER_ID = 'userid';
var ACTIVE_CUST_ID = 'customerid';
var ACTIVE_ORDER='orderid'
var ACTIVE_ITEMS='OrderedItems'

export {USER_ID,ACTIVE_CUST_ID,ACTIVE_ORDER,ACTIVE_ITEMS}
module.exports = {
    BASE_URL :'http://143.110.178.47/primeorder/',
     SET_URL:'http://143.110.178.47/primeorder/set_data_s.php',
    GET_URL:'http://143.110.178.47/primeorder/get_data_s.php',
    GET_DATA_ORDO:'http://143.110.178.47/primeorder/get_data_ordo.php',
    // LOGIN_URL :'http://143.110.178.47/primeorder/log_in_crm.php' ,
    LOGIN_URL :'http://143.110.178.47/primeorder/log_in_ordo.php' ,
    DOCUMENT_URL:'http://ec2-13-58-157-192.us-east-2.compute.amazonaws.com/CRM-BHI/get_document_crm_2.php',
    TYPE_DATA_URL:'http://143.110.178.47/primeorder/get_data_ltype.php',
   GET_RETURN_URL:'http://143.110.178.47/primeorder/getreturnArray.php',
    GET_HISTORY_URL :'http://143.110.178.47/primeorder/gethistoryitems.php',
    LOGOUT_URL:'http://ec2-13-58-157-192.us-east-2.compute.amazonaws.com/CRM-BHI/log_out_crm.php'
  };