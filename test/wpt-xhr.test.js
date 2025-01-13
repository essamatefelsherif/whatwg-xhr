/**
 * @module  wpt-xhr
 * @desc    The wpt-xhr test module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/** Import test scripts */
import abort_event_order                                                from './wpt/xhr/abort-event-order.js';
import data_uri                                                         from './wpt/xhr/data-uri.js';
import event_abort_any                                                  from './wpt/xhr/event-abort.any.js';
import event_error_order_sub                                            from './wpt/xhr/event-error-order.sub.js';
import event_error_sub_any                                              from './wpt/xhr/event-error.sub.any.js';
import event_load_any                                                   from './wpt/xhr/event-load.any.js';
import event_loadend_any                                                from './wpt/xhr/event-loadend.any.js';
import event_loadstart_any                                              from './wpt/xhr/event-loadstart.any.js';
import event_loadstart_upload_any                                       from './wpt/xhr/event-loadstart-upload.any.js';
import event_progress_any                                               from './wpt/xhr/event-progress.any.js';
import event_readystatechange_loaded_any                                from './wpt/xhr/event-readystatechange-loaded.any.js';
import event_readystate_sync_open_any                                   from './wpt/xhr/event-readystate-sync-open.any.js';
import event_timeout_any                                                from './wpt/xhr/event-timeout.any.js';
import event_timeout_order_any                                          from './wpt/xhr/event-timeout-order.any.js';
import event_upload_progress_any                                        from './wpt/xhr/event-upload-progress.any.js';
import formdata                                                         from './wpt/xhr/formdata.js';
import formdata_append_any                                              from './wpt/xhr/formdata/append.any.js';
import formdata_constructor_any                                         from './wpt/xhr/formdata/constructor.any.js';
import formdata_delete_any                                              from './wpt/xhr/formdata/delete.any.js';
import formdata_foreach_any                                             from './wpt/xhr/formdata/foreach.any.js';
import formdata_get_any                                                 from './wpt/xhr/formdata/get.any.js';
import formdata_has_any                                                 from './wpt/xhr/formdata/has.any.js';
import formdata_iteration_any                                           from './wpt/xhr/formdata/iteration.any.js';
import formdata_set_any                                                 from './wpt/xhr/formdata/set.any.js';
import formdata_set_blob_any                                            from './wpt/xhr/formdata/set-blob.any.js';
import firing_events_http_content_length                                from './wpt/xhr/firing-events-http-content-length.js';
import firing_events_http_no_content_length                             from './wpt/xhr/firing-events-http-no-content-length.js';
import getallresponseheaders_cookies                                    from './wpt/xhr/getallresponseheaders-cookies.js';
import getallresponseheaders                                            from './wpt/xhr/getallresponseheaders.js';
import getallresponseheaders_status                                     from './wpt/xhr/getallresponseheaders-status.js';
import getresponseheader_case_insensitive                               from './wpt/xhr/getresponseheader-case-insensitive.js';
import getresponseheader_chunked_trailer                                from './wpt/xhr/getresponseheader-chunked-trailer.js';
import getresponseheader_cookies_and_more                               from './wpt/xhr/getresponseheader-cookies-and-more.js';
import getresponseheader_error_state                                    from './wpt/xhr/getresponseheader-error-state.js';
import getresponseheader_server_date                                    from './wpt/xhr/getresponseheader-server-date.js';
import getresponseheader_special_characters                             from './wpt/xhr/getresponseheader-special-characters.js';
import getresponseheader_unsent_opened_state                            from './wpt/xhr/getresponseheader-unsent-opened-state.js';
import headers_normalize_response                                       from './wpt/xhr/headers-normalize-response.js';
import header_user_agent_async                                          from './wpt/xhr/header-user-agent-async.js';
import header_user_agent_sync                                           from './wpt/xhr/header-user-agent-sync.js';
import historical                                                       from './wpt/xhr/historical.js';
import loadstart_and_state                                              from './wpt/xhr/loadstart-and-state.js';
import open_after_abort                                                 from './wpt/xhr/open-after-abort.js';
import open_after_setrequestheader                                      from './wpt/xhr/open-after-setrequestheader.js';
import open_during_abort                                                from './wpt/xhr/open-during-abort.js';
import open_during_abort_event                                          from './wpt/xhr/open-during-abort-event.js';
import open_during_abort_processing                                     from './wpt/xhr/open-during-abort-processing.js';
import open_method_bogus                                                from './wpt/xhr/open-method-bogus.js';
import open_method_case_insensitive                                     from './wpt/xhr/open-method-case-insensitive.js';
import open_method_case_sensitive                                       from './wpt/xhr/open-method-case-sensitive.js';
import open_method_insecure                                             from './wpt/xhr/open-method-insecure.js';
import open_method_responsetype_set_sync                                from './wpt/xhr/open-method-responsetype-set-sync.js';
import open_open_send                                                   from './wpt/xhr/open-open-send.js';
import open_open_sync_send                                              from './wpt/xhr/open-open-sync-send.js';
import open_parameters_toString                                         from './wpt/xhr/open-parameters-toString.js';
import open_send_during_abort                                           from './wpt/xhr/open-send-during-abort.js';
import open_send_open                                                   from './wpt/xhr/open-send-open.js';
import open_sync_open_send                                              from './wpt/xhr/open-sync-open-send.js';
import open_url_base                                                    from './wpt/xhr/open-url-base.js';
import open_url_encoding                                                from './wpt/xhr/open-url-encoding.js';
import open_url_fragment                                                from './wpt/xhr/open-url-fragment.js';
import overridemimetype_headers_received_state_force_shiftjis           from './wpt/xhr/overridemimetype-headers-received-state-force-shiftjis.js';
import overridemimetype_invalid_mime_type                               from './wpt/xhr/overridemimetype-invalid-mime-type.js';
import overridemimetype_loading_state                                   from './wpt/xhr/overridemimetype-loading-state.js';
import overridemimetype_open_state_force_utf_8                          from './wpt/xhr/overridemimetype-open-state-force-utf-8.js';
import preserve_ua_header_on_redirect                                   from './wpt/xhr/preserve-ua-header-on-redirect.js';
import progressevent_constructor                                        from './wpt/xhr/progressevent-constructor.js';
import progressevent_interface                                          from './wpt/xhr/progressevent-interface.js';
import progress_events_response_data_gzip                               from './wpt/xhr/progress-events-response-data-gzip.js';
import response_body_errors                                             from './wpt/xhr/response-body-errors.any.js';
import response_data_arraybuffer                                        from './wpt/xhr/response-data-arraybuffer.js';
import response_data_blob                                               from './wpt/xhr/response-data-blob.js';
import response_data_progress                                           from './wpt/xhr/response-data-progress.js';
import response_invalid_responsetype                                    from './wpt/xhr/response-invalid-responsetype.js';
import response_json                                                    from './wpt/xhr/response-json.js';
import response_method                                                  from './wpt/xhr/response-method.js';
import responsetext_decoding                                            from './wpt/xhr/responsetext-decoding.js';
import responsetext_status                                              from './wpt/xhr/responsetext-status.js';
import send_accept                                                      from './wpt/xhr/send-accept.js';
import send_accept_language                                             from './wpt/xhr/send-accept-language.js';
import send_blob_with_no_mime_type                                      from './wpt/xhr/send-blob-with-no-mime-type.js';
import send_content_type_charset                                        from './wpt/xhr/send-content-type-charset.js';
import send_content_type_string                                         from './wpt/xhr/send-content-type-string.js';
import send_data_blob                                                   from './wpt/xhr/send-data-blob.js';
import send_entity_body_basic                                           from './wpt/xhr/send-entity-body-basic.js';
import send_entity_body_empty                                           from './wpt/xhr/send-entity-body-empty.js';
import send_entity_body_get_head                                        from './wpt/xhr/send-entity-body-get-head.js';
import send_entity_body_get_head_async                                  from './wpt/xhr/send-entity-body-get-head-async.js';
import send_entity_body_none                                            from './wpt/xhr/send-entity-body-none.js';
import send_network_error_async_events_sub                              from './wpt/xhr/send-network-error-async-events.sub.js';
import send_network_error_sync_events_sub                               from './wpt/xhr/send-network-error-sync-events.sub.js';
import send_no_response_event_loadend                                   from './wpt/xhr/send-no-response-event-loadend.js';
import send_no_response_event_loadstart                                 from './wpt/xhr/send-no-response-event-loadstart.js';
import send_no_response_event_order                                     from './wpt/xhr/send-no-response-event-order.js';
import send_receive_utf16                                               from './wpt/xhr/send-receive-utf16.js';
import send_redirect                                                    from './wpt/xhr/send-redirect.js';
import send_redirect_bogus                                              from './wpt/xhr/send-redirect-bogus.js';
import send_redirect_bogus_sync                                         from './wpt/xhr/send-redirect-bogus-sync.js';
import send_redirect_infinite                                           from './wpt/xhr/send-redirect-infinite.js';
import send_redirect_infinite_sync                                      from './wpt/xhr/send-redirect-infinite-sync.js';
import send_redirect_no_location                                        from './wpt/xhr/send-redirect-no-location.js';
import send_redirect_post_upload                                        from './wpt/xhr/send-redirect-post-upload.js';
import send_response_event_order                                        from './wpt/xhr/send-response-event-order.js';
import send_response_upload_event_loadend                               from './wpt/xhr/send-response-upload-event-loadend.js';
import send_response_upload_event_loadstart                             from './wpt/xhr/send-response-upload-event-loadstart.js';
import send_response_upload_event_progress                              from './wpt/xhr/send-response-upload-event-progress.js';
import send_sync_blocks_async                                           from './wpt/xhr/send-sync-blocks-async.js';
import send_sync_no_response_event_loadend                              from './wpt/xhr/send-sync-no-response-event-loadend.js';
import send_sync_no_response_event_load                                 from './wpt/xhr/send-sync-no-response-event-load.js';
import send_sync_no_response_event_order                                from './wpt/xhr/send-sync-no-response-event-order.js';
import send_sync_response_event_order                                   from './wpt/xhr/send-sync-response-event-order.js';
import send_sync_timeout                                                from './wpt/xhr/send-sync-timeout.js';
import send_timeout_events                                              from './wpt/xhr/send-timeout-events.js';
import setrequestheader_after_send                                      from './wpt/xhr/setrequestheader-after-send.js';
import setrequestheader_allow_empty_value                               from './wpt/xhr/setrequestheader-allow-empty-value.js';
import setrequestheader_allow_whitespace_in_value                       from './wpt/xhr/setrequestheader-allow-whitespace-in-value.js';
import setrequestheader_before_open                                     from './wpt/xhr/setrequestheader-before-open.js';
import setrequestheader_bogus_name                                      from './wpt/xhr/setrequestheader-bogus-name.js';
import setrequestheader_bogus_value                                     from './wpt/xhr/setrequestheader-bogus-value.js';
import setrequestheader_case_insensitive                                from './wpt/xhr/setrequestheader-case-insensitive.js';
import setrequestheader_content_type                                    from './wpt/xhr/setrequestheader-content-type.js';
import setrequestheader_header_allowed                                  from './wpt/xhr/setrequestheader-header-allowed.js';
import setrequestheader_header_forbidden                                from './wpt/xhr/setrequestheader-header-forbidden.js';
import setrequestheader_open_setrequestheader                           from './wpt/xhr/setrequestheader-open-setrequestheader.js';
import status_async                                                     from './wpt/xhr/status-async.js';
import status_basic                                                     from './wpt/xhr/status-basic.js';
import status_error                                                     from './wpt/xhr/status-error.js';
import xmlhttprequest_basic                                             from './wpt/xhr/xmlhttprequest-basic.js';
import xmlhttprequest_eventtarget                                       from './wpt/xhr/xmlhttprequest-eventtarget.js';
import xmlhttprequest_network_error                                     from './wpt/xhr/xmlhttprequest-network-error.js';
import xmlhttprequest_network_error_sync                                from './wpt/xhr/xmlhttprequest-network-error-sync.js';
import xmlhttprequest_unsent                                            from './wpt/xhr/xmlhttprequest-unsent.js';

/** @const {object} cmdOptions - Command line options */
import cmdOptions from './wpt-xhr.cmd.js';

let activeURL = new URL (cmdOptions.url).href;
activeURL = activeURL.substring(0, activeURL.length - 1);

/** Prepare test environment */

let testCount   = 0;
let passCount   = 0;
let failCount   = 0;
let cancelCount = 0;
let skipCount   = 0;
let todoCount   = 0;
let startTime   = Date.now();

const suites = new Map();

/**
 * @func Main
 * @desc The application entry point function
 */
(() => {
	loadTestData();

	cmdOptions.verbose && splash();

	if(cmdOptions.node){
		import('node:test')
			.then(runner => {
				nodeRunner(runner);
			})
			.catch(() => {
				defRunner();
			});
	}
	else{
		defRunner();
	}

})('Main Function');

/**
 * @func loadTestData
 * @desc Load test data
 */
function loadTestData(){

	let testData = null;
	let suiteDesc = '';

	// TEST SUITE #1 - XMLHttpRequest
	suiteDesc = 'XMLHttpRequest';
	suites.set(suiteDesc, []);

		// TEST 001 - XMLHttpRequest - prototype and members
		testData = {};
		testData.desc = 'XMLHttpRequest - prototype and members';
		testData.method = xmlhttprequest_basic;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 002 - XMLHttpRequest - implements EventTarget
		testData = {};
		testData.desc = 'XMLHttpRequest - implements EventTarget';
		testData.method = xmlhttprequest_eventtarget;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 003 - XMLHttpRequest - members during network errors (async)
		testData = {};
		testData.desc = 'XMLHttpRequest - members during network errors (async)';
		testData.method = xmlhttprequest_network_error;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 004 - XMLHttpRequest - members during network errors (sync)
		testData = {};
		testData.desc = 'XMLHttpRequest - members during network errors (sync)';
		testData.method = xmlhttprequest_network_error_sync;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 005 - XMLHttpRequest - members during UNSENT
		testData = {};
		testData.desc = 'XMLHttpRequest - members during UNSENT';
		testData.method = xmlhttprequest_unsent;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #2 - Events
	suiteDesc = 'Events';
	suites.set(suiteDesc, []);

		// TEST 006 - event - abort event
		testData = {};
		testData.desc = 'event - abort event';
		testData.method = event_abort_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 007 - event - error (order of events)
		testData = {};
		testData.desc = 'event - error (order of events)';
		testData.method = event_error_order_sub;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 008 - event - error event
		testData = {};
		testData.desc = 'event - error event';
		testData.method = event_error_sub_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 009 - event - load event
		testData = {};
		testData.desc = 'event - load event';
		testData.method = event_load_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 010 - event - loadend event
		testData = {};
		testData.desc = 'event - loadend event';
		testData.method = event_loadend_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 011 - event - loadstart event
		testData = {};
		testData.desc = 'event - loadstart event';
		testData.method = event_loadstart_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 012 - event - loadstart on upload object
		testData = {};
		testData.desc = 'event - loadstart on upload object';
		testData.method = event_loadstart_upload_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 013 - event - the LOADING state change may be emitted multiple times
		testData = {};
		testData.desc = 'event - the LOADING state change may be emitted multiple times';
		testData.method = event_readystatechange_loaded_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 014 - event - open() - call fires sync readystate event
		testData = {};
		testData.desc = 'event - open() - call fires sync readystate event';
		testData.method = event_readystate_sync_open_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 015 - event - timeout event
		testData = {};
		testData.desc = 'event - timeout event';
		testData.method = event_timeout_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 016 - event - timeout (order of events)
		testData = {};
		testData.desc = 'event - timeout (order of events)';
		testData.method = event_timeout_order_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 017 - event - progress event
		testData = {};
		testData.desc = 'event - progress event';
		testData.method = event_progress_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 018 - event - upload progress event
		testData = {};
		testData.desc = 'event - upload progress event';
		testData.method = event_upload_progress_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #3 - Progress Events
	suiteDesc = 'Progress Events';
	suites.set(suiteDesc, []);

		// TEST 019 - ProgressEvent - constructor
		testData = {};
		testData.desc = 'ProgressEvent - constructor';
		testData.method = progressevent_constructor;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 020 - ProgressEvent - interface
		testData = {};
		testData.desc = 'ProgressEvent - interface';
		testData.method = progressevent_interface;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 021 - ProgressEvent - firing events for HTTP with Content-Length
		testData = {};
		testData.desc = 'ProgressEvent - firing events for HTTP with Content-Length';
		testData.method = firing_events_http_content_length;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 022 - ProgressEvent - firing events for HTTP with NO Content-Length
		testData = {};
		testData.desc = 'ProgressEvent - firing events for HTTP with NO Content-Length';
		testData.method = firing_events_http_no_content_length;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 023 - ProgressEvent - and GZIP encoding
		testData = {};
		testData.desc = 'ProgressEvent - and GZIP encoding';
		testData.method = progress_events_response_data_gzip;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #4 - Headers
	suiteDesc = 'Headers';
	suites.set(suiteDesc, []);

		// TEST 024 - Headers - Whitespace and null in header values
		testData = {};
		testData.desc = 'Headers - Whitespace and null in header values';
		testData.method = headers_normalize_response;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 025 - Headers - Test that async requests are sent with the User-Agent header
		testData = {};
		testData.desc = 'Headers - Test that async requests are sent with the User-Agent header';
		testData.method = header_user_agent_async;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 026 - Headers - Test that sync requests are sent with the User-Agent header
		testData = {};
		testData.desc = 'Headers - Test that sync requests are sent with the User-Agent header';
		testData.method = header_user_agent_sync;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 027 - Headers - User-Agent header is preserved on redirect
		testData = {};
		testData.desc = 'Headers - User-Agent header is preserved on redirect';
		testData.method = preserve_ua_header_on_redirect;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #5 - Methods - open
	suiteDesc = 'Methods - open';
	suites.set(suiteDesc, []);

		// TEST 028 - open() - after abort()
		testData = {};
		testData.desc = 'open() - after abort()';
		testData.method = open_after_abort;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 029 - open() - after setRequestHeader()
		testData = {};
		testData.desc = 'open() - after setRequestHeader()';
		testData.method = open_after_setrequestheader;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 030 - open() - during abort()
		testData = {};
		testData.desc = 'open() - during abort()';
		testData.method = open_during_abort;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 031 - open() - bogus methods
		testData = {};
		testData.desc = 'open() - bogus methods';
		testData.method = open_method_bogus;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 032 - open() - case-insensitive methods test
		testData = {};
		testData.desc = 'open() - case-insensitive methods test';
		testData.method = open_method_case_insensitive;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 033 - open() - "insecure" methods
		testData = {};
		testData.desc = 'open() - "insecure" methods';
		testData.method = open_method_insecure;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 034 - open() - sync request not allowed if responseType is set
		testData = {};
		testData.desc = 'open() - sync request not allowed if responseType is set';
		testData.method = open_method_responsetype_set_sync;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 035 - open() - attempts to toString its string parameters
		testData = {};
		testData.desc = 'open() - attempts to toString its string parameters';
		testData.method = open_parameters_toString;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 036 - open() - open() - send()
		testData = {};
		testData.desc = 'open() - open() - send()';
		testData.method = open_open_send;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 037 - open() - open() (sync) - send()
		testData = {};
		testData.desc = 'open() - open() (sync) - send()';
		testData.method = open_open_sync_send;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 038 - open() - send() - open()
		testData = {};
		testData.desc = 'open() - send() - open()';
		testData.method = open_send_open;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 039 - open() - during abort()
		testData = {};
		testData.desc = 'open() - during abort()';
		testData.method = open_send_during_abort;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 040 - open() - (sync) - send() - open()
		testData = {};
		testData.desc = 'open() - (sync) - send() - open()';
		testData.method = open_sync_open_send;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 041 - open() - resolving URLs
		testData = {};
		testData.desc = 'open() - resolving URLs';
		testData.method = open_url_base;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 042 - open() - resolving URLs - fragment identifier
		testData = {};
		testData.desc = 'open() - resolving URLs - fragment identifier';
		testData.method = open_url_fragment;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #6 - Methods - setRequestHeader
	suiteDesc = 'Methods - setRequestHeader';
	suites.set(suiteDesc, []);

		// TEST 043 - setRequestHeader() - after send()
		testData = {};
		testData.desc = 'setRequestHeader() - after send()';
		testData.method = setrequestheader_after_send;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 044 - setRequestHeader() - empty header
		testData = {};
		testData.desc = 'setRequestHeader() - empty header';
		testData.method = setrequestheader_allow_empty_value;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 045 - setRequestHeader() - header value with whitespace
		testData = {};
		testData.desc = 'setRequestHeader() - header value with whitespace';
		testData.method = setrequestheader_allow_whitespace_in_value;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 046 - setRequestHeader() - before open()
		testData = {};
		testData.desc = 'setRequestHeader() - before open()';
		testData.method = setrequestheader_before_open;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 047 - setRequestHeader() - name argument checks
		testData = {};
		testData.desc = 'setRequestHeader() - name argument checks';
		testData.method = setrequestheader_bogus_name;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 048 - setRequestHeader() - value argument checks
		testData = {};
		testData.desc = 'setRequestHeader() - value argument checks';
		testData.method = setrequestheader_bogus_value;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 049 - setRequestHeader() - headers that differ in case
		testData = {};
		testData.desc = 'setRequestHeader() - headers that differ in case';
		testData.method = setrequestheader_case_insensitive;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 050 - setRequestHeader() - Content-Type header
		testData = {};
		testData.desc = 'setRequestHeader() - Content-Type header';
		testData.method = setrequestheader_content_type;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 051 - setRequestHeader() - headers that are allowed
		testData = {};
		testData.desc = 'setRequestHeader() - headers that are allowed';
		testData.method = setrequestheader_header_allowed;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 052 - setRequestHeader() - headers that are forbidden
		testData = {};
		testData.desc = 'setRequestHeader() - headers that are forbidden';
		testData.method = setrequestheader_header_forbidden;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 053 - setRequestHeader() - and open()
		testData = {};
		testData.desc = 'setRequestHeader() - and open()';
		testData.method = setrequestheader_open_setrequestheader;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #7 - Methods - overrideMimeType
	suiteDesc = 'Methods - overrideMimeType';
	suites.set(suiteDesc, []);

		// TEST 054 - overrideMimeType() - in HEADERS RECEIVED state, enforcing Shift-JIS encoding
		testData = {};
		testData.desc = 'overrideMimeType() - in HEADERS RECEIVED state, enforcing Shift-JIS encoding';
		testData.method = overridemimetype_headers_received_state_force_shiftjis;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 055 - overrideMimeType() - and invalid MIME types
		testData = {};
		testData.desc = 'overrideMimeType() - and invalid MIME types';
		testData.method = overridemimetype_invalid_mime_type;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 056 - overrideMimeType() - in LOADING state
		testData = {};
		testData.desc = 'overrideMimeType() - in LOADING state';
		testData.method = overridemimetype_loading_state;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 057 - overrideMimeType() - in open state, enforcing UTF-8 encoding
		testData = {};
		testData.desc = 'overrideMimeType() - in open state, enforcing UTF-8 encoding';
		testData.method = overridemimetype_open_state_force_utf_8;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #8 - Methods - send
	suiteDesc = 'Methods - send';
	suites.set(suiteDesc, []);

		// TEST 058 - send() - Accept
		testData = {};
		testData.desc = 'send() - Accept';
		testData.method = send_accept;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 059 - send() - Accept-Language
		testData = {};
		testData.desc = 'send() - Accept-Language';
		testData.method = send_accept_language;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 060 - send() - Blob data with no mime type
		testData = {};
		testData.desc = 'send() - Blob data with no mime type';
		testData.method = send_blob_with_no_mime_type;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 061 - send() - Content-Type
		testData = {};
		testData.desc = 'send() - Content-Type';
		testData.method = send_content_type_string;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 062 - send() - charset parameter of Content-Type
		testData = {};
		testData.desc = 'send() - charset parameter of Content-Type';
		testData.method = send_content_type_charset;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 063 - send() - method: Blob data
		testData = {};
		testData.desc = 'send() - method: Blob data';
		testData.method = send_data_blob;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 064 - send() - data argument
		testData = {};
		testData.desc = 'send() - data argument';
		testData.method = send_entity_body_basic;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 065 - send() - "" empty entity body
		testData = {};
		testData.desc = 'send() - "" empty entity body';
		testData.method = send_entity_body_empty;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 066 - send() - non-empty data argument and GET/HEAD - async, no upload events should fire
		testData = {};
		testData.desc = 'send() - non-empty data argument and GET/HEAD - async, no upload events should fire';
		testData.method = send_entity_body_get_head_async;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 067 - send() - non-empty data argument and GET/HEAD, no upload events should fire
		testData = {};
		testData.desc = 'send() - non-empty data argument and GET/HEAD, no upload events should fire';
		testData.method = send_entity_body_get_head;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 068 - send() - null entity body
		testData = {};
		testData.desc = 'send() - null entity body';
		testData.method = send_entity_body_none;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 069 - send() - Fire a progress event named error when Network error happens (synchronous flag is unset
		testData = {};
		testData.desc = 'send() - Fire a progress event named error when Network error happens (synchronous flag is unset)';
		testData.method = send_network_error_async_events_sub;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 070 - send() - Throw a "throw an "NetworkError" exception when Network error happens (synchronous flag is set)
		testData = {};
		testData.desc = 'send() - Throw a "throw an "NetworkError" exception when Network error happens (synchronous flag is set)';
		testData.method = send_network_error_sync_events_sub;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 071 - send() - Fire a progress event named loadend (no response entity body)
		testData = {};
		testData.desc = 'send() - Fire a progress event named loadend (no response entity body)';
		testData.method = send_no_response_event_loadend;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 072 - send() - Fire a progress event named loadstart (no response entity body and the state is LOADING)
		testData = {};
		testData.desc = 'send() - Fire a progress event named loadstart (no response entity body and the state is LOADING)';
		testData.method = send_no_response_event_loadstart;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 073 - send() - event order when there is no response entity body
		testData = {};
		testData.desc = 'send() - event order when there is no response entity body';
		testData.method = send_no_response_event_order;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 074 - send() - receive data which is UTF-16 encoded
		testData = {};
		testData.desc = 'send() - receive data which is UTF-16 encoded';
		testData.method = send_receive_utf16;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 075 - send() - Redirects (basics)
		testData = {};
		testData.desc = 'send() - Redirects (basics)';
		testData.method = send_redirect;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 076 - send() - Redirects (bogus Location header)
		testData = {};
		testData.desc = 'send() - Redirects (bogus Location header)';
		testData.method = send_redirect_bogus;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 077 - send() - Redirects (bogus Location header; sync)
		testData = {};
		testData.desc = 'send() - Redirects (bogus Location header; sync)';
		testData.method = send_redirect_bogus_sync;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 078 - send() - Redirects (infinite loop)
		testData = {};
		testData.desc = 'send() - Redirects (infinite loop)';
		testData.method = send_redirect_infinite;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 079 - send() - Redirects (infinite loop; sync)
		testData = {};
		testData.desc = 'send() - Redirects (infinite loop; sync)';
		testData.method = send_redirect_infinite_sync;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 080 - send() - POSTing to URL that redirects
		testData = {};
		testData.desc = 'send() - POSTing to URL that redirects';
		testData.method = send_redirect_post_upload;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 081 - send() - event order when synchronous flag is unset
		testData = {};
		testData.desc = 'send() - event order when synchronous flag is unset';
		testData.method = send_response_event_order;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 082 - send() - Fire a progress event named loadstart on the XMLHttpRequestUpload (synchronous flag is unset)
		testData = {};
		testData.desc = 'send() - Fire a progress event named loadstart on the XMLHttpRequestUpload (synchronous flag is unset)';
		testData.method = send_response_upload_event_loadstart;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 083 - send() - Fire a progress event named loadend on the XMLHttpRequestUpload (synchronous flag is unset)
		testData = {};
		testData.desc = 'send() - Fire a progress event named loadend on the XMLHttpRequestUpload (synchronous flag is unset)';
		testData.method = send_response_upload_event_loadend;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 084 - send() - Fire a progress event named progress on the XMLHttpRequestUpload (synchronous flag is unset)
		testData = {};
		testData.desc = 'send() - Fire a progress event named progress on the XMLHttpRequestUpload (synchronous flag is unset)';
		testData.method = send_response_upload_event_progress;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 085 - send() - sync requests should block events on pending async requests
		testData = {};
		testData.desc = 'send() - sync requests should block events on pending async requests';
		testData.method = send_sync_blocks_async;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 086 - send() - event order when synchronous flag is set and there is no response entity body
		testData = {};
		testData.desc = 'send() - event order when synchronous flag is set and there is no response entity body';
		testData.method = send_sync_no_response_event_order;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 087 - send() - Fire an event named loadend (no response entity body and the synchronous flag is set)
		testData = {};
		testData.desc = 'send() - Fire an event named loadend (no response entity body and the synchronous flag is set)';
		testData.method = send_sync_no_response_event_load;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 088 - send() - Fire an event named loadend (no response entity body and the synchronous flag is set)
		testData = {};
		testData.desc = 'send() - Fire an event named loadend (no response entity body and the synchronous flag is set)';
		testData.method = send_sync_no_response_event_loadend;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 089 - send() - event order when synchronous flag is set
		testData = {};
		testData.desc = 'send() - event order when synchronous flag is set';
		testData.method = send_sync_response_event_order;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 090 - send() - timeout during sync send() should not run
		testData = {};
		testData.desc = 'send() - timeout during sync send() should not run';
		testData.method = send_sync_timeout;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 091 - send() - timeout is not 0
		testData = {};
		testData.desc = 'send() - timeout is not 0';
		testData.method = send_timeout_events;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #9 - Methods - abort
	suiteDesc = 'Methods - abort';
	suites.set(suiteDesc, []);

		// TEST 092 - abort() - abort and loadend events
		testData = {};
		testData.desc = 'abort() - abort and loadend events';
		testData.method = abort_event_order;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #10 - Methods - getAllResponseHeaders
	suiteDesc = 'Methods - getAllResponseHeaders';
	suites.set(suiteDesc, []);

		// TEST 093 - getAllResponseHeaders() - excludes cookies
		testData = {};
		testData.desc = 'getAllResponseHeaders() - excludes cookies';
		testData.method = getallresponseheaders_cookies;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 094 - getAllResponseHeaders() - excludes status line (HTTP/1.1 ...)
		testData = {};
		testData.desc = 'getAllResponseHeaders() - excludes status line (HTTP/1.1 ...)';
		testData.method = getallresponseheaders_status;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #11 - Methods - getResponseHeader
	suiteDesc = 'Methods - getResponseHeader';
	suites.set(suiteDesc, []);

		// TEST 095 - getResponseHeader() - case-insensitive matching
		testData = {};
		testData.desc = 'getResponseHeader() - case-insensitive matching';
		testData.method = getresponseheader_case_insensitive;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 096 - getResponseHeader() - and HTTP trailer
		testData = {};
		testData.desc = 'getResponseHeader() - and HTTP trailer';
		testData.method = getresponseheader_chunked_trailer;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 097 - getResponseHeader() - custom/non-existent headers and cookies
		testData = {};
		testData.desc = 'getResponseHeader() - custom/non-existent headers and cookies';
		testData.method = getresponseheader_cookies_and_more;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 098 - getResponseHeader() - in error state
		testData = {};
		testData.desc = 'getResponseHeader() - in error state';
		testData.method = getresponseheader_error_state;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 099 - getResponseHeader() - server and date
		testData = {};
		testData.desc = 'getResponseHeader() - server and date';
		testData.method = getresponseheader_server_date;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 100 - getResponseHeader() - funny characters
		testData = {};
		testData.desc = 'getResponseHeader() - funny characters';
		testData.method = getresponseheader_special_characters;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 101 - getResponseHeader() - in unsent, opened states
		testData = {};
		testData.desc = 'getResponseHeader() - in unsent, opened states';
		testData.method = getresponseheader_unsent_opened_state;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #12 - Response
	suiteDesc = 'Response';
	suites.set(suiteDesc, []);

		// TEST 102 - transmitting two chunks TEST_CHUNK and then garbage, which should result in an error
		testData = {};
		testData.desc = 'transmitting two chunks TEST_CHUNK and then garbage, which should result in an error';
		testData.method = response_body_errors;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 103 - response - ArrayBuffer data
		testData = {};
		testData.desc = 'response - ArrayBuffer data';
		testData.method = response_data_arraybuffer;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 104 - response - Blob data
		testData = {};
		testData.desc = 'response - Blob data';
		testData.method = response_data_blob;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 105 - progress events grow response body size
		testData = {};
		testData.desc = 'progress events grow response body size';
		testData.method = response_data_progress;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 106 - responseType - is plain text if responseType is set to an invalid string
		testData = {};
		testData.desc = 'responseType - is plain text if responseType is set to an invalid string';
		testData.method = response_invalid_responsetype;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 107 - responseType - json
		testData = {};
		testData.desc = 'responseType - json';
		testData.method = response_json;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 108 - responseText - status
		testData = {};
		testData.desc = 'responseText - status';
		testData.method = responsetext_status;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 109 - responseText - decoding
		testData = {};
		testData.desc = 'responseText - decoding';
		testData.method = responsetext_decoding;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #13 - Status
	suiteDesc = 'Status';
	suites.set(suiteDesc, []);

		// TEST 110 - status/statusText - various responses
		testData = {};
		testData.desc = 'status/statusText - various responses';
		testData.method = status_async;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 111 - status/statusText - basic
		testData = {};
		testData.desc = 'status/statusText - basic';
		testData.method = status_basic;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 112 - status - error handling
		testData = {};
		testData.desc = 'status - error handling';
		testData.method = status_error;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #14 - FormData
	suiteDesc = 'FormData';
	suites.set(suiteDesc, []);

		// TEST 113 - XMLHttpRequest: Construct and upload FormData
		testData = {};
		testData.desc = 'XMLHttpRequest: Construct and upload FormData';
		testData.method = formdata;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 114 - FormData Constructor
		testData = {};
		testData.desc = 'FormData Constructor';
		testData.method = formdata_constructor_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 115 - FormData set
		testData = {};
		testData.desc = 'FormData set';
		testData.method = formdata_set_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 116 - FormData set-blob
		testData = {};
		testData.desc = 'FormData set-blob';
		testData.method = formdata_set_blob_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 117 - FormData get
		testData = {};
		testData.desc = 'FormData get';
		testData.method = formdata_get_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 118 - FormData append
		testData = {};
		testData.desc = 'FormData append';
		testData.method = formdata_append_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 119 - FormData delete
		testData = {};
		testData.desc = 'FormData delete';
		testData.method = formdata_delete_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 120 - FormData has
		testData = {};
		testData.desc = 'FormData has';
		testData.method = formdata_has_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 121 - FormData iteration
		testData = {};
		testData.desc = 'FormData iteration';
		testData.method = formdata_iteration_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 122 - FormData forEach
		testData = {};
		testData.desc = 'FormData forEach';
		testData.method = formdata_foreach_any;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

	// TEST SUITE #15 - Miscellaneous
	suiteDesc = 'Miscellaneous';
	suites.set(suiteDesc, []);

		// TEST 123 - data URLs
		testData = {};
		testData.desc = 'data URLs';
		testData.method = data_uri;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 124 - historical features
		testData = {};
		testData.desc = 'historical features';
		testData.method = historical;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);

		// TEST 125 - loadstart event corner cases
		testData = {};
		testData.desc = 'loadstart event corner cases';
		testData.method = loadstart_and_state;

		testData.skip = false;
		suites.get(suiteDesc).push(testData);
}

/**
 * @func  nodeRunner
 * @param {object} runner - The node core module 'node:test' object
 * @desc  Carry out the loaded tests using node test runner
 */
function nodeRunner(runner){

	let startTime, success;

	if(cmdOptions.verbose){

		const callbackBefore = () => {
			process.stderr.write(`wptTest-${(++testCount).toString().padStart(3, '0')} ... `);
			startTime = Date.now();
			success = true;
		};

		const callbackAfter = (t) => {
			let duration = Date.now() - startTime;
			process.stderr.write(`${success ? 'success' : 'failure'} ... ${String(duration).padStart(6)} msec ... ${t.name}\n`);
		};

		runner.beforeEach(callbackBefore);
		runner.afterEach(callbackAfter);
	}

	for(let [suiteDesc, suiteTests] of suites){
		runner.suite(suiteDesc, () => {
			for(let testObj of suiteTests){
				runner.test(testObj.desc, {skip: testObj.skip}, (t) => {
					if(cmdOptions.verbose){
						try{
							testObj.method(activeURL);
						}
						catch(err){
							success = false; throw err;
						}
					}
					else{
						testObj.method(activeURL);
					}
				});
			}
		});
	}
}

/* node:coverage disable */

/**
 * @func  defRunner
 * @desc  Carry out the loaded tests using this developed test runner
 */
function defRunner(){

	let startTime, success;
	let callbackBefore, callbackAfter

	if(cmdOptions.verbose){
		callbackBefore = () => {
			process.stderr.write(`wptTest-${(++testCount).toString().padStart(3, '0')} ... `);
			startTime = Date.now();
			success = true;
		};

		callbackAfter = (testObj) => {
			let duration = Date.now() - startTime;
			process.stderr.write(`${success ? 'success' : 'failure'} ... ${String(duration).padStart(6)} msec ... ${testObj.desc}\n`);
		};
	}

	cmdOptions.verbose && process.on('exit', () => {
		console.log();
		console.log('▶ tests',       testCount);
		console.log('▶ suites',      suites.size);
		console.log('▶ pass',        passCount);
		console.log('▶ fail',        failCount);
		console.log('▶ cancelled',   cancelCount);
		console.log('▶ skipped',     skipCount);
		console.log('▶ todo',        todoCount);
		console.log('▶ duration_ms', Math.round(Date.now() - startTime));
	});

	cmdOptions.verbose && console.error();

	for(let [suiteDesc, suiteTests] of suites){
		for(let testObj of suiteTests){
			if(!testObj.skip){
				if(cmdOptions.verbose){
					callbackBefore();
					try{
						testObj.method(activeURL);
						++passCount;
					}
					catch(err){
						success = false;
						++failCount;
					}
					callbackAfter(testObj);
				}
				else{
					testObj.method(activeURL);
					++passCount;
				}
			}
			else{
				++skipCount;
			}
		}
	}

	cmdOptions.verbose && console.error();
}

/* node:coverage enable */

/**
 * @func splash
 * @desc The application splash screen
 */
function splash(){

const banner = String.raw`
  __   ____  __ _      _    _ _   _         _____                            _
  \ \ / /  \/  | |    | |  | | | | |       |  __ \                          | |
   \ V /| \  / | |    | |__| | |_| |_ _ __ | |__) |___  __ _ _   _  ___  ___| |_
    > < | |\/| | |    |  __  | __| __| '_ \|  _  // _ \/ _  | | | |/ _ \/ __| __|
   / . \| |  | | |____| |  | | |_| |_| |_) | | \ \  __/ (_| | |_| |  __/\__ \ |_
  /_/ \_\_|  |_|______|_|  |_|\__|\__| .__/|_|  \_\___|\__, |\__,_|\___||___/\__|
                                     | |                  | |
                                     |_|                  |_|
`;

	console.clear();
	console.log(banner);
	console.log();

	let url = new URL(activeURL);

	console.log();
	console.log(`▶ Test Server: ${url.host}`);
	console.log();
}

/*
 * imported - but not included
 *
 *    open_url_encoding(activeURL);             // results different from browser environment
 *
 * imported - skipped
 *
 *    getallresponseheaders(activeURL);         // using insecure http parser is required
 *    open_during_abort_event(activeURL);
 *    open_during_abort_processing(activeURL);
 *    open_method_case_sensitive(activeURL);    // nodeJS http module always uppercase methods
 *    response_method(activeURL);               // using insecure http parser is required
 *    send_redirect_no_location(activeURL);     // requires xml parser
 *
 * imported - included but not fully tested
 *
 *    send_content_type_charset(activeURL);     // not fully tested
 *    setrequestheader_content_type(activeURL); // not fully tested - FormData not tested
 *    status_basic(activeURL);                  // not fully tested type=text/xml
 *
 * imported - tested but suspicious
 *
 *    response_data_progress(activeURL);        // failure with content-length not included
 *
 * imported - tested but to be revised
 *
 *    progressevent_interface(activeURL);       // revise/complete progressevent-interface.js
 *    open_open_send(activeURL);                // unknown failure
 */
