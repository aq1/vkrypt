console.log('VKrypt is loaded');


var logURL = function(requestDetails) {
    console.log(requestDetails.requestBody.formData.msg[0]);
    requestDetails.requestBody.formData.msg[0] = 'NOPE';
};

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["https://vk.com/al_im.php"]},
  ["blocking", "requestBody"]
);
