const emailText = (name, link, host) => {
  let fullLink = `http://${host.trim()}${link.trim()}`
 
  return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
  <style>
  html,
  body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background: #f1f1f1;
  }
  
  * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
  }
  
  div[style*="margin: 16px 0"] {
      margin: 0 !important;
  }
  
  
  table,
  td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
  }
  
  
  table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
  }
  
  img {
      -ms-interpolation-mode:bicubic;
  }
  
  a {
      text-decoration: none;
  }
  
  *[x-apple-data-detectors],  /* iOS */
  .unstyle-auto-detected-links *,
  .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
  }
  
  .a6S {
      display: none !important;
      opacity: 0.01 !important;
  }
  
  .im {
      color: inherit !important;
  }
  
  img.g-img + div {
      display: none !important;
  }
  
  @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u ~ div .email-container {
          min-width: 320px !important;
      }
  }
  
  @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u ~ div .email-container {
          min-width: 375px !important;
      }
  }
  
  @media only screen and (min-device-width: 414px) {
      u ~ div .email-container {
          min-width: 414px !important;
      }
  }
  
  </style>
  
  
  <style>
  
    .primary{
    background: #ccc;
  }
  
  .email-section{
    padding:2.5em;
  }
  
  /*BUTTON*/
  .btn{
    padding: 5px 15px;
    display: inline-block;
  }
  
  .btn.btn-white-outline{
    border-radius: 5px;
    background: transparent;
    border: 1px solid #000;
    color: #000;
  }
  
  h2{
    font-family: 'Poppins', sans-serif;
    color: #000;
    margin-top: 0;
  }
  
  body{
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.8;
    color: #000000;
  }
  
  a, .dark{
    color: #000000;
  }
  
  /*HEADING SECTION*/
  .heading-section h2{
    color: #000000;
    font-size: 20px;
    margin-top: 0;
    line-height: 1.4;
    font-weight: 700;
    text-transform: uppercase;
  }
  
  .heading-section-white h2{
    font-family: 
    line-height: 1;
    padding-bottom: 0;
  }
  .heading-section-white h2{
    color: #000000;
  }
  
  @media screen and (max-width: 500px) {
    .text-services{
      padding-left: 0;
      padding-right: 20px;
      text-align: left;
    }
  
  }
  </style>
  
  
  </head>
  
  <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
    <center style="width: 100%; background-color: #f1f1f1;">
      <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      </div>
      <div style="max-width: 600px; margin: 0 auto;" class="email-container">
        <!-- BEGIN BODY -->
        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
          <tr>
            <td class="bg_white">
                <tr>
                  <td class="primary email-section" style="text-align:center;">
                    <div class="heading-section heading-section-white">
                      <h2>${name}'s Result</h2>
                      <p class="dark">Click the link below to view ${name}'s result.</p>
                      <p><a href="${fullLink}" class="btn btn-white-outline">View Result</a></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>
  </html>`
};
const emailText2 = (pwd) => {
  
  return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
  <style>
  html,
  body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background: #f1f1f1;
  }
  
  * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
  }
  
  div[style*="margin: 16px 0"] {
      margin: 0 !important;
  }
  
  
  table,
  td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
  }
  
  
  table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
  }
  
  img {
      -ms-interpolation-mode:bicubic;
  }
  
  a {
      text-decoration: none;
  }
  
  *[x-apple-data-detectors],  /* iOS */
  .unstyle-auto-detected-links *,
  .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
  }
  
  .a6S {
      display: none !important;
      opacity: 0.01 !important;
  }
  
  .im {
      color: inherit !important;
  }
  
  img.g-img + div {
      display: none !important;
  }
  
  @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u ~ div .email-container {
          min-width: 320px !important;
      }
  }
  
  @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u ~ div .email-container {
          min-width: 375px !important;
      }
  }
  
  @media only screen and (min-device-width: 414px) {
      u ~ div .email-container {
          min-width: 414px !important;
      }
  }
  
  </style>
  
  
  <style>
  
    .primary{
    background: #ccc;
  }
  
  .email-section{
    padding:2.5em;
  }
  
  /*BUTTON*/
  .btn{
    padding: 5px 15px;
    display: inline-block;
  }
  
  .btn.btn-white-outline{
    border-radius: 5px;
    background: transparent;
    border: 1px solid #000;
    color: #000;
  }
  
  h2{
    font-family: 'Poppins', sans-serif;
    color: #000;
    margin-top: 0;
  }
  
  body{
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.8;
    color: #000000;
  }
  
  a, .dark{
    color: #000000;
  }
  
  /*HEADING SECTION*/
  .heading-section h2{
    color: #000000;
    font-size: 20px;
    margin-top: 0;
    line-height: 1.4;
    font-weight: 700;
    text-transform: uppercase;
  }
  
  .heading-section-white h2{
    font-family: 
    line-height: 1;
    padding-bottom: 0;
  }
  .heading-section-white h2{
    color: #000000;
  }
  
  @media screen and (max-width: 500px) {
    .text-services{
      padding-left: 0;
      padding-right: 20px;
      text-align: left;
    }
  
  }
  </style>
  
  
  </head>
  
  <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
    <center style="width: 100%; background-color: #f1f1f1;">
      <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      </div>
      <div style="max-width: 600px; margin: 0 auto;" class="email-container">
        <!-- BEGIN BODY -->
        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
          <tr>
            <td class="bg_white">
                <tr>
                  <td class="primary email-section" style="text-align:center;">
                    <div class="heading-section heading-section-white">
                      <h2>Get your new password below</h2>
                      <p class="dark">Your new password is ${pwd} do not share it with anyone, change it on login</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>
  </html>`
};

module.exports = { emailText, emailText2 };
