var MP_TOOLS = {
    init: function () {
        this.setActiveMenu();
    },
    setActiveMenu: function () {
        $(".menu-column").find("a[href='" + window.location.pathname + "']").addClass("active");
    },
    toast: function (title, text, type) {
        if (type === 'success') {
            toastr.success(text);
        } else if (type === 'error') {
            toastr.error(text);
        } else if (type === 'warning') {
            toastr.warning(text);
        }
    },
    startLoading: function () {
        $('#loader').removeClass('d-none');
    },
    stopLoading: function () {
        $('#loader').addClass('d-none');
    },

    convertDateToTimezone: function (date, concat = false, tzEnabled = false, gmt = false) {
        let tz = '+00:00'
        let res = '---';
        if (date) {
            let data = date
            if (concat) {
                data = date.includes("Z") ? data : data.concat("Z");
            }
            if (tzEnabled) {
                tz = '+03:00'
                res = moment(data).utcOffset(tz).format('MMM DD, YYYY h:mm a');
            } else {
                if (gmt) {
                    res = moment(data).utcOffset(tz).format('MMM DD, YYYY h:mm a');
                } else {
                    res = moment(data).utcOffset(tz).local().format('MMM DD, YYYY h:mm a');
                }
            }
        }
        return res;
    },

    formatDate: function (dt) {
        return dt.format("YYYY-MM-DDTHH:mm:ss")
    },

    openModalPost: function (url, post_params, is_large, is_extra_large, callBackFn) {
        $("#main_modal .modal-dialog").removeClass('modal-xl')
        $("#main_modal .modal-dialog").removeClass('modal-lg')

        if (is_large) {
            $("#main_modal .modal-dialog").addClass('modal-lg')
        } else {
            if (is_extra_large) {
                $("#main_modal .modal-dialog").addClass('modal-xl')
            }
        }

        $("#main_modal").modal({backdrop: 'static', keyboard: false});
        $("#main_modal").modal('show');
        $("#main_modal .modal-content").html('<div class="modal-body"><center><h5 class="m-form__heading-title"><i class="fa fa-spin fa-spinner"></i> Loading... </h5></center></div>')
        $("#main_modal .modal-content").load(url, post_params, function (response, status, xhr) {
            if (status != "error") {
                if (typeof callBackFn != 'undefined')
                    callBackFn();
            }
        });
    },


    openModal: function (url, is_large, is_extra_large, callBackFn) {
        $("#main_modal .modal-dialog").removeClass('modal-xl')
        $("#main_modal .modal-dialog").removeClass('modal-lg')

        if (is_large) {
            $("#main_modal .modal-dialog").addClass('modal-lg')
        } else {
            if (is_extra_large) {
                $("#main_modal .modal-dialog").addClass('modal-xl')
            }
        }

        $("#main_modal").modal({backdrop: 'static', keyboard: false});
        $("#main_modal").modal('show');
        $("#main_modal .modal-content").html('<div class="modal-body"><center><h5 class="m-form__heading-title"><i class="fa fa-spin fa-spinner"></i> Loading... </h5></center></div>')
        $("#main_modal .modal-content").load(url, function (response, status, xhr) {
            if (status != "error") {
                if (typeof callBackFn != 'undefined')
                    callBackFn();
            }
        });
    },

    openModalTwo: function (url, is_large, is_extra_large, callBackFn) {
        $("#main_modal2 .modal-dialog").removeClass('modal-xl')
        $("#main_modal2 .modal-dialog").removeClass('modal-lg')

        if (is_large) {
            $("#main_modal2 .modal-dialog").addClass('modal-lg')
        } else {
            if (is_extra_large) {
                $("#main_modal2 .modal-dialog").addClass('modal-xl')
            }
        }

        $("#main_modal2").modal({backdrop: 'static', keyboard: false});
        $("#main_modal2").modal('show');
        $("#main_modal2 .modal-content").html('<div class="modal-body"><center><h5 class="m-form__heading-title"><i class="fa fa-spin fa-spinner"></i> Loading... </h5></center></div>')
        $("#main_modal2 .modal-content").load(url, function (response, status, xhr) {
            if (status != "error") {
                if (typeof callBackFn != 'undefined')
                    callBackFn();
            }
        });
    },

    closeModal: function () {
        $("#main_modal").modal('hide');
        setTimeout(function () {
            $("#main_modal .modal-content").html('')
        }, 500);
    },

    closeModalTwo: function () {
        $("#main_modal2").modal('hide');
        setTimeout(function () {
            $("#main_modal2 .modal-content").html('')
        }, 500);
    },


    copyTextToClipboard: function (text) {
        var that = this;

        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            MP_TOOLS.toast('success', 'Copied Url: ' + text, 'success');
        }, function (err) {
            MP_TOOLS.toast('error', 'Could not copy text', 'error');
        });
    },
    fallbackCopyTextToClipboard: function (text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            if (successful) {
                MP_TOOLS.toast('success', 'Copied Url: ' + text, 'success');
            }
        } catch (err) {
            MP_TOOLS.toast('error', 'Could not copy text', 'error');
        }

        document.body.removeChild(textArea);
    },

    dateRangePickerInit: function (that) {
        $('#dateFilter').removeClass('d-none')

        let picker = $('#date_range_filter');
        admin_site_module_1.daterangepickerInit(picker, function (start, end, rangeText) {

            that.start_dt = start;
            that.end_dt = end;
            /*if (rangeText) {
                $('#date_range_filter').val(rangeText);
            }*/

            that.refreshGrid();

        }, false, that.start_dt, that.end_dt, []);

        //picker.val("All");
    },

    deleteCookie: function (key) {
        document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    setCookie: function (key, value) {
        document.cookie = key + "=" + value + ";path=/";
    },
    getCookie: function (cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    humanizeNumber: function (number) {
        var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

        // what tier? (determines SI symbol)
        var tier = Math.log10(Math.abs(number)) / 3 | 0;

        // if zero, we don't need a suffix
        if (tier === 0) return number;

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);

        // scale the number
        var scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(3) + suffix;
    },

    renderResultInsideDataTable: function (key, value) {
        let icon
        let text_color = "text-black"
        if (value === true) {
            icon = '<i class="fa fa-check text-success"></i>'
        } else if (value === false) {
            icon = '<i class="fa fa-times text-danger"></i>'
        } else if (value === null) {
            icon = value
            text_color = "text-muted"
        } else {
            icon = value
        }

        return (`
            <span class="${text_color}">
                <span class="social-user-name b-none p-t-0 ps-2">${key}</span>
                <span class="social-label b-none p-t-0 text-left">${icon}</span>
            </span>
            `)
    },

    renderResult: function (key, value) {
        let icon
        if (value === true) {
            icon = '<i class="fa fa-check text-success"></i>'
        } else if (value === false) {
            icon = '<i class="fa fa-times text-danger"></i>'
        } else {
            icon = value
        }

        return (`
            <tr>
                <th class="social-user-name b-none text-muted p-t-0 ps-2">${key}</th>
                <td class="social-label b-none p-t-0 text-left">${icon}</i>
                </td>
            </tr>
            `)
    },

    renderTable: function (table_values, id) {
        let result = ''

        for (let [key, value] of Object.entries(table_values)) {
            result += MP_TOOLS.renderResult(key, value) + `<br>`
        }

        $(id).find('tbody').html(result)
    },

    renderMSISDN: function (mUrl, row, clickable = true) {
        if (clickable) {
            return ('<a href="' + mUrl + '"<div data-row-id="' + row.id
                + '">' + row.msisdn + '</div></a>')
        } else {
            return ('<div class="text-primary"> ' + row.msisdn + ' </div>')
        }

    },
}


var
    MP_API = {
        xhrs: [],
        abort: function (xhr) {
            xhr.abort();
        },
        call: function (url, data, type, successFn, errorFn, completeFn, contains_upload) {
            var that = this;

            var processData = true;
            var contentType = "application/x-www-form-urlencoded; charset=UTF-8";

            if (contains_upload) {
                processData = false;
                contentType = false;
            }

            if (successFn === null)
                successFn = function (resp) {
                };

            if (errorFn == null)
                errorFn = function () {
                };

            if (completeFn == null)
                completeFn = function () {
                };

            var xhr = $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: "json",
                processData: processData,
                contentType: contentType,
                success: successFn,
                error: errorFn,
                complete: function () {
                    completeFn();
                    var tmpXhrIdx = that.xhrs.indexOf(xhr);
                    that.xhrs.splice(tmpXhrIdx, 1);
                }
            });

            this.xhrs.push(xhr);

            return xhr;
        }
    }

$(function () {
    MP_TOOLS.init();
});


(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);
