
App = {

  registerUser: function (user) {

    var found = App.validateUserLoggedIn();
    if (!found) {
      $('.message-text-center').css('color', 'red');
      $('.message-text-center').css('align', 'center');
      $('.message-text-center').text("ERROR: " + "You can only see this after you've logged in.");
      return;
    }

    $.get('/getCertificate/' + user, function (res) {
      debugger;
      console.log(res);

      if (res && res.result !== 'success') {

        $('.message-text-center').css('color', 'red');
        $('.message-text-center').css('align', 'center');
        $('.message-text-center').text("ERROR: " + res.message);

      } else {
        $('.message-text-center').css('color', 'blue');
        $('.message-text-center').css('align', 'center');
        $('.message-text-center').text("INFORMATION: User " + res.message + '\n Secret: ' + res.pwd);

      }

      // else {

      //   $('.message-text-center').css('color', 'red');
      //   $('.message-text-center').css('align', 'center');
      //   $('.message-text-center').text("ERROR: Enter valid user-name for certificate registration.");
      // }

    });
  },

  userValidation: function (event) {
    debugger;
    $('#progress-bar').show();

    var userName = $('#txt-username').val().trim();
    var pwd = $('#txt-password').val().trim();
    if (userName && pwd) {
      App.userValidationOnChainCode(userName, pwd);
      $('#progress-bar').hide();
    } else {
      $('.message-text-center').css('color', 'red');
      $('.message-text-center').css('align', 'center');
      $('.message-text-center').text("ERROR: Invalid user-name & password.");
      $('#progress-bar').hide();
    }
  },

  userValidationOnChainCode: function (user, pwd) {

    var cred = user + '-' + pwd;
    $.get('/userAuthenticate/' + cred, function (res) {

      if (res && res.result !== 'success') {

        $('.message-text-center').css('color', 'red');
        $('.message-text-center').css('align', 'center');
        $('.message-text-center').text("ERROR: " + res.message);

      } else {
        sessionStorage.setItem("loginUser", user);
        console.log('Navigate to dashboard page..');
        location.href = 'dashboard.html';
        // $('.message-text-center').css('color', 'blue');
        // $('.message-text-center').css('align', 'center');
        // $('.message-text-center').text("INFORMATION: User " + res.message);       

      }
    });
  },

  getCertificate: function (event) {
    // var userName = $('#txt-username').val().trim();
    // var pwd = $('#txt-password').val().trim();
    // if (userName && pwd) {
    //   // App.registerUser(userName);            
    // } else {
    //   $('.message-text-center').css('color', 'red');
    //   $('.message-text-center').css('align', 'center');
    //   $('.message-text-center').text("ERROR: Invalid user-name & password.");
    // }
  },

  registerEnrollPage: function (event) {
    console.log('Navigate to enroll page..');
    location.href = 'registerandenroll.html';
  },

  registerEnroll: function (event) {

    $('#progress-bar').show();
    var userName = $('#txt-reg-username').val().trim();
    var pwd = $('#txt-reg-password').val().trim();
    var first = $('#txt-reg-firstname').val().trim();
    var last = $('#txt-reg-lastname').val().trim();

    if (userName && pwd && first && last) {
      App.registerEnrollChaincode(userName, pwd, first, last);
      $('#progress-bar').hide();
    } else {
      $('.message-text-center').css('color', 'red');
      $('.message-text-center').css('align', 'center');
      $('.message-text-center').text("ERROR: All fields are mandatory.  ");
      $('#progress-bar').hide();
    }
  },

  registerEnrollChaincode: function (userName, pwd, first, last) {

    var userinfo = userName + '-' + pwd + '-' + first + '-' + last;
    $.get('/addNewUser/' + userinfo, function (res) {

      if (res && res.result !== 'success') {
        $('.message-text-center').css('color', 'red');
        $('.message-text-center').css('align', 'center');
        $('.message-text-center').text("ERROR: " + res.message);

      } else {
        $('.message-text-center').css('color', 'blue');
        $('.message-text-center').css('align', 'center');
        $('.message-text-center').text("INFORMATION: User " + res.message);
      }
    });
  },

  getAllCounts: function () {
    var stds = App.getAllStudents();
    if (stds) {
      $("#student-count").text(stds.length);
    }
    App.getAllBlocksCount();
  },

  getAllStudents: function () {

    var found = this.validateUserLoggedIn();
    if (!found) {
      $('.message-text-center').css('color', 'red');
      $('.message-text-center').css('align', 'center');
      $('.message-text-center').text("ERROR: " + "You can only see this after you've logged in.");
      location.href = 'index.html';
      return;
    }
    var stds = null;
    App.ajaxRequest('/getAllStudents/', "", function (e) {
      debugger;
      stds = JSON.parse(e.message);
    }, function (e) { });
    return stds;
  },

  showGrid: function (dataAdapter) {
    debugger;
    $("#student-grid").jqxGrid(
      {
        source: dataAdapter,
        width: "900px",
        height: "600px",
        theme: 'ui-start',
        autorowheight: true,
        autoheight: true,
        columns: [
          { text: 'Id', datafield: 'id', width: 100 },
          { text: 'FirstName', datafield: 'firstname', width: 300 },
          { text: 'LastName', datafield: 'lastname', width: 300 },
          { text: 'Class', datafield: 'class', width: 100 },
          { text: 'Section', datafield: 'section', width: 100 },
          // { text: 'Total', datafield: 'total', width: 100, cellsalign: 'right', cellsformat: 'c2' }
        ],
        showtoolbar: true,
        rendertoolbar: function (statusbar) {
          var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
          var addButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='images/add.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Add</span></div>");
          var deleteButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='images/close.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Delete</span></div>");
          var reloadButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='images/refresh.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Reload</span></div>");
          // var searchButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='../../images/search.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Find</span></div>");
          container.append(addButton);
          container.append(deleteButton);
          container.append(reloadButton);
          statusbar.append(container);
          addButton.jqxButton({ width: 60, height: 20 });
          deleteButton.jqxButton({ width: 65, height: 20 });
          reloadButton.jqxButton({ width: 65, height: 20 });
          addButton.click(function (event) {
            // var datarow = generatedata(1);
            // $("#grid").jqxGrid('addrow', null, datarow[0]); 
            App.showStudentFormWindow();
          });
          deleteButton.click(function (event) {
            // var selectedrowindex = $("#grid").jqxGrid('getselectedrowindex');
            // var rowscount = $("#grid").jqxGrid('getdatainformation').rowscount;
            // var id = $("#grid").jqxGrid('getrowid', selectedrowindex);
            // $("#grid").jqxGrid('deleterow', id);
          });
          // reload grid data.
          reloadButton.click(function (event) {
            debugger;
            var stds = App.getAllStudents();
            if (stds) {
              var source =
              {
                localdata: stds,
                datatype: "json"
              };
              var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function (data) { },
                loadError: function (xhr, status, error) { }
              });
              $('#student-grid').jqxGrid({ source: dataAdapter });
            }
          });
        }

      });
  },

  showStudentGrid: function () {
    var found = App.validateUserLoggedIn();
    if (!found) {
      $('.message-text-center').css('color', 'red');
      $('.message-text-center').css('align', 'center');
      $('.message-text-center').text("ERROR: " + "You can only see this after you've logged in.");
      location.href = 'index.html';
      return;
    }
    $.get('/getAllStudents/', function (res) {
      if (res.result === 'success') {
        var stds = JSON.parse(res.message);
        if (stds) {
          var source =
          {
            localdata: stds,
            datatype: "json"
          };
          var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { }
          });
          App.showGrid(dataAdapter);
        }
      } else {
      }
    });
  },

  validateUserLoggedIn: function () {
    var userName = sessionStorage.getItem("loginUser");
    if (userName) {
      return true;
    }
    return false;
  },

  getAllBlocks: function () {

    // var found = this.validateUserLoggedIn();
    //   if(!found){
    //     $('.message-text-center').css('color', 'red');
    //     $('.message-text-center').css('align', 'center');
    //     $('.message-text-center').text("ERROR: " + "You can only see this after you've logged in.");        
    //     location.href = 'index.html';
    //     return;
    //   }   

    $.get('/getAllBlocks/', function (res) {
      debugger;
      if (res.result === 'success') {
        var blocks = JSON.parse(res.message);
        if (blocks) {
          //Fill blocks information into template.
          $.each(blocks, function (index, block) {
            var blockRow = $('#blockRow');
            var blockTemplate = $('#blockTemplate');
            blockTemplate.find('.block-id').text(block.id);
            blockTemplate.find('.block-fingerprint').text(block.fingerprint);
            if (block.transactions) {
              var transactions = JSON.parse(block.transactions);
              if (transactions) {
                blockTemplate.find('.block-type').text(transactions[0].type);
                blockTemplate.find('.block-channel').text(transactions[0].channel_id);
                blockTemplate.find('.block-time').text(transactions[0].timestamp);
                blockTemplate.find('.block-tx-id').text(transactions[0].tx_id);
              }
              blockRow.append(blockTemplate.html());
            }
          });
        }
      }
    });
  },

  getAllBlocksCount: function () {
    $.get('/getAllBlocks/', function (res) {
      debugger;
      if (res.result === 'success') {
        var blocks = JSON.parse(res.message);
        if (blocks) {
          $('#block-exp-count').text(blocks.length);
          //block-exp-count
          //return blocks.length;
        }
      }
    });
  },

  ajaxRequest: function (url, data, successCallback, errorCallback) {
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      data: data,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (e) {
        successCallback(e);
      },
      error: function (e) {
        errorCallback(e);
      }
    });
  },

  addNewStudent: function () {
    debugger;
    var id = 0;
    var grid = $('#student-grid').jqxGrid('getrows');
    if (grid) {
      id = grid.length + 1;
    }
    var firstName = $('#student-first-name').val().trim();
    var lastName = $('#student-last-name').val().trim();
    var clas = $('#student-class').val().trim();
    var sec = $('#student-section').val().trim();
    var stdinfo = id + '-' + firstName + '-' + lastName + '-' + clas + '-' + sec;
    App.ajaxRequest('/addNewStudent/' + stdinfo, "", function (e) {
      debugger;
      $('#student-window').jqxWindow('close');
      App.showSuccessNotification("student-notification", e.message);
    }, function (e) { });
  },

  showStudentFormWindow: function () {

    $('#student-first-name').val('');        
    $('#student-last-name').val('');        
    $('#student-class').val('');        
    $('#student-section').val('');

    $('#student-window').jqxWindow({
      position: 'center',
      showCollapseButton: true,
      draggable: true,
      resizable: false,
      maxHeight: 380,
      maxWidth: 600,
      height: 380,
      width: 600,
      theme: 'ui-start',
      initContent: function () {
        $('#student-window').jqxWindow('focus');        
      }
    });
    $('#student-window').jqxWindow('open');
  },

  showSuccessNotification: function (div, message) {
    $('#' + div).text(message)
    $('#' + div).jqxNotification({
      width: 250,
      position: "top-right",
      opacity: 0.9,
      autoOpen: false,
      animationOpenDelay: 800,
      autoClose: true,
      autoCloseDelay: 3000,
      template: "success"
    });
    $('#' + div).jqxNotification("open");
  }

};