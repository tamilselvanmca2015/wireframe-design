$(document).ready(function() {
    $.getJSON("https://api.ipify.org/?format=json", async function(e) {
        apiCall(1,e.ip);
    });
    $(".see_all_table").on('click',function() {
        console.log($("#see_all_openings").position().top - 100);
        $('html, body').animate({
            'scrollTop' : $("#see_all_openings").position().top - 100
        });
    });
    
    
    // $('#example').DataTable( {
    //     "ajax" : "./data.json",
    //     "paging":   true,
    //     "ordering": false,
    //     "info":     false,
    //     columns: [
    //         {
    //             data: 'title'
    //         },
    //         {
    //             data: 'code'
    //         },
    //         {
    //             data: 'location'
    //         },
    //         {
    //             data: 'pay'
    //         },
    //         {
    //             data: 'start_date'
    //         },
    //         {
    //             data: 'infos'
    //         },
    //         {
    //             data:'id',
    //             render: function(data, type) {
    //                 return '<button type="button" class="btn btn-primary btn-lg px-4 gap-3 btn-see-all apply" data-id="'+data+'">Apply</button>';
    //             }
    //         }
    //     ]
    // });
});
function  apiCall(pageNumber,myIp){
    console.log("myIp",myIp);
    let list = '';
    $('#example').before('<div class="loader text-center"><div class="spinner-border" role="status"><span class="sr-only"></span></div></div>');
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://amazon-eu.herokuapp.com/api/v1/openings?ip_address="+myIp+"&per_page=10&page="+pageNumber,
        dataType: "json",
        //headers : { "X-ACCESS-TOKEN":"aaabbbcccddd111222333444"},
        success: function (data) {
            $('.dynamic_data').empty();
            console.log(data);
            //let openings = data.data;
            data.data.openings.map( (data) => {
                list += '<tr><td style="width:20%">'+data.title+'</td><td>'+data.location_site_code+'</td><td style="width:20%">'+data.operation+'</td><td>'+data.pay+'</td><td>'+new Date(data.date_posted).getDate()+'</td><td>Additional Info</td><td><a href="'+data.url+'" target="_blank"><button type="button" class="btn btn-primary btn-lg px-4 gap-3 btn-see-all apply" data-id="'+data.id+'">Apply</button></a></td></tr>'
            })
            $('.dynamic_data').append(list);
            $('.pagination-numbers').empty();
            $('.pagination-numbers').append(pagination(parseInt(pageNumber),data.data.pagination.last));
            //console.log(pagination(1,15));
            $('.loader').remove();

            clickInitialize();  
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //-- log error
        }
    });
} 
function pagination(c, m) {
    var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        paginationList = '',
        l;
    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            console.log("startt*******",i);
console.log("last", last);
console.log("left", left);
console.log("right", right);
console.log("end*******");

            range.push(i);
        }

    }
    console.log("raange",range);
    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                console.log("inside",l);
                rangeWithDots.push(parseInt(l) + 1);
                let pageNum = parseInt(l) + 1;
                paginationList += '<li style="cursor:pointer" class="page" data-total="'+m+'" data-page="'+ pageNum +'" >'+ pageNum +'</li>';

            } else if (i - l !== 1) {
                rangeWithDots.push('...');
                paginationList += '<li  class="page">...</li>';

            }
        }
        let activeState = (i == c) ? "active":"";
        paginationList += '<li style="cursor:pointer" class="page '+activeState+'" data-total="'+m+'" data-page="'+i+'">'+i+'</li>';
        rangeWithDots.push(i);
        l = i;
    }
    clickInitialize();
    return paginationList;
}

function clickInitialize(){
    $('.page').on("click",(event) => {
        let currentPage = $(event.target).attr("data-page");
        let totalPage = $(event.target).attr("data-total");
        console.log(currentPage);
        console.log(totalPage);
        apiCall(currentPage);
        //$('.pagination-numbers').empty();
        //$('.pagination-numbers').append(pagination(parseInt(currentPage),parseInt(totalPage)));
        //console.log(pagination(currentPage, totalPage));
        //clickInitialize();

    })
    let currentPage = parseInt($('.page.active').attr("data-page"));
    $( ".prev" ).unbind("click");
    $( ".next" ).unbind("click");


    $('.prev').click((event) => {
        apiCall(currentPage - 1);

    })
    $('.next').click((event) => {
        apiCall(currentPage + 1);

    })
}