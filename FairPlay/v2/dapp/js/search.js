const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
var baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/v2/dapp/';
var webBrowser = new AppLink();
var abi = "";

const getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const isAddress = function (address) {
    // function isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return "true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
}


const isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = web3.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
}

const dispatchSearch = async (method) => {
    $(".more-plays").addClass("d-none")
    $(".loader").removeClass("d-none")

    //$(".more-plays").text(lgb["loading"]||"Loading...")

    if(method == 'created'){
      $(".card-tips").addClass("normal-font")

      $(".card-tips").html(lgb["giveaways_icreated"] || "Giveaways, I created...")
      
      $(".rm-giveaway").removeClass("d-none")

      const n = await ICreatedButton()
      if(n){
        //$(".card-tips").html(n + "  " + lgb["giveaways_icreated"] || "Giveaways, I created...") 
        if(n<=10){
          $(".more-plays").text(lgb["nomore"]||"No more itmes.")
        }       
      }else{
        $(".card-tips").html(lgb["no_create"] || "You haven't created giveaway.")
        $(".more-plays").addClass("d-none")
        $("#create-btn").removeClass("d-none")
      }
    }else if(method == "participated"){
      $("#create-btn").addClass("d-none")
      $(".card-tips").addClass("normal-font")
      $(".card-tips").html(lgb["giveaways_iparticipated"] || "Giveaways, I participated...")
      const n = await IParticipatedButton()
      if(n){
        if(n<=10){
          $(".more-plays").text(lgb["nomore"]||"No more itmes.")
        } 
        //$(".card-tips").html(n + lgb["giveaways_iparticipated"] || "Giveaways, I participated..." )        
      }else{
        $(".card-tips").html(lgb["try_now"] || "You haven't participated. Why not try now?")
        $(".more-plays").addClass("d-none")
        $("#searchAddressInput").val("0x67bc96cb6667Ff38Fd2E308f6781184Bf43B8F7d")
        searchButton();
      }
    }else if(method == "won"){
      $("#create-btn").addClass("d-none")
      $(".card-tips").addClass("normal-font")
      $(".card-tips").html(lgb["giveaways_iwon"] || "Giveaways, I won...")
      const n = await IWonButton()
      if(n){
        if(n<=10){
          $(".more-plays").text(lgb["nomore"]||"No more itmes.")
        } 
        //$(".card-tips").html(n + "  " + lgb["giveaways_iwon"] || "Giveaways, I won...")        
      }else{
        $(".card-tips").html(lgb["try_again"] || "You haven't created giveaway. Why not try again?")
        $(".more-plays").addClass("d-none")
        $("#searchAddressInput").val("0x67bc96cb6667Ff38Fd2E308f6781184Bf43B8F7d")
        searchButton();
      }
    }else{
      $("#create-btn").addClass("d-none")

      srch_term = getUrlParameter("srch-term").toLowerCase()
      if(isAddress(srch_term)){
        $("#searchAddressInput").val(srch_term)
      }else{
        $("#searchTextInput").val(srch_term);
        console.log( $("#searchTextInput").val())
      }
      const n = await searchButton();
      $(".card-tips").html(n + (lgb['normal_unit'] || " ") + (lgb["search_result"] || "Search Results"))
      if(n <= 10){
        $(".more-plays").text(lgb["nomore"] || "No more items.")
      }      
    }
    $(".more-plays").removeClass("d-none")
    $(".loader").addClass("d-none")
}



var initLanguage = function () {
    if (lgb == '' || lgb == null) {
        return;
    }
     $("[data-translate]").each(function(){
        var key = $(this).data('translate');
        if(lgb[key]){
            if(this.tagName.toLowerCase() == "input" || this.tagName.toLowerCase() == "textarea"){
                $(this).attr("placeholder", lgb[key])
            }else{
                $(this).html(lgb[key]);
            }
        }
    });
}
var initBtn = function(){
    $("#create-btn").attr("href", baseUrl + "create.html")
    $(".href-index").attr("href", baseUrl + "index.html")
    
    $(".more-plays").click(()=>{
      var moreitems = 0   
      var n_itmes = $(".card").length
      $(".card").each((i, obj)=>{
        if(!$(obj).hasClass("card-template") && $(obj).hasClass("d-none") && moreitems < 10){
            $(obj).removeClass("d-none")
            moreitems ++
            if(i == n_itmes - 1){
              $(".more-plays").html(lgb["nomore"]||"No more itmes.")
            }
        }
      });
    });
} 

$('#confirmDelCreated').on('show.bs.modal', function (e) {
    var addr = $(e.relatedTarget).attr("alt");
    var title = $(e.relatedTarget).siblings( ".giveaway-title").text();    
    console.log("contract to delete:", addr, "tilte", title)
    $(".giveaway-to-del").text((lgb["title"] || title) + ": " +  title)
    $(".giveaway-to-del").attr("alt",  addr)

    $("#user-addr-input").val(addr)
    $(".cp-addr-btn").text(lgb["copy"] || "copy")
})

var bindClearCreated = () => {
    $("#confirm-del").click(()=>{
        contract_address = $(".giveaway-to-del").attr("alt")
        contract = web3.cmt.contract(abi);
        instance = contract.at(contract_address);
        instance.kill(function(e, r){
          if(e){
            console.log("error")
            $("#confirmDelCreated").modal("hide")
          }else{
            $("#" + contract_address).detach()
            $("#confirmDelCreated").modal("hide")
          }
        })
    })
}

var getAbi = function () {
    $.ajax({
        url: 'FairPlay.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
}


$(document).ready(function() {

  webBrowser.openBrowser();
  initLanguage();
  getAbi();
  initBtn();

  var method = getUrlParameter("method");
  dispatchSearch(method)

  bindClearCreated();

})