var appTestsConfig=[
	{
		"name":"Bastart(DigiByte Mobile)",
		"master":"DigiByte seed",
		"derivation":"m",
		"start":"D"
	},
	{
		"name":"Bastard(DigiByte Go)",
		"master":"Bitcoin seed",
		"derivation":"m/44'/0'",
		"start":"D"
	},
	{
		"name":"BIP44",
		"master":"Bitcoin seed",
		"derivation":"m/44'/20'",
		"start":"D"
	},
	{
		"name":"BIP49",
		"master":"Bitcoin seed",
		"derivation":"m/49'/20'",
		"start":"S"
	},
	{
		"name":"BIP84",
		"master":"Bitcoin seed",
		"derivation":"m/84'/20'",
		"start":"dgb"
	}
	/*
	type,
	hd	
	*/
];


function isValidAddress(addressString) {
	var bitcoinAddress=bitcoinjs['bitcoin']['address'];
	if (addressString['toUpperCase']()['substr'](0,4)=='DGB1') {
		try {
			bitcoinAddress['fromBech32'](addressString);
			return true;
		} catch(e) {
			//unlikely but may be valid base58 address so do nothing here
		}
	}
	if ((addressString[0]=='D')||(addressString[0]=='S')) {
		try {
			bitcoinAddress['fromBase58Check'](addressString);
			return true;
		} catch(e) {
			//returns false below anyways so catch it is invalid only
		}
	}
	return false;
}





var i=false;
var run=false;
var account=0;
var appTests;
var checkAddress;

var showResults=function(message) {
	document.getElementById('results').innerHTML=message;
}
setInterval(function() {
	if (i===false) showResults('');							//clear when reset
	if (run) {
		i++;											//try next
		showResults('Testing index: '+i);				//let user know what we are doing
		for (var test of appTests) {
			var address=test.hd.derive(i).keyPair.getAddress(test.start);
			if (address==checkAddress) {
				showResults(test.name+" "+test.type+" address found at "+test.derivation+"/"+i);
				run=false;
			}
		}	
	}
},10);



document.getElementById('search').addEventListener('click',function(e) {
	if (run) showResults('Search Canceled');
	run=false;
});
document.getElementById('search').addEventListener('click',function(e) {
	showResults('Starting Search');
	i=-1;
	setTimeout(function() {
		
		//validate account
		account=document.getElementById('account').value;
		if (account!=parseInt(account)+'') {
			showResults('Invalid Account Number');
			return;
		}
		account=parseInt(account);
		if ((account<0)||(account>=0x80000000)) {
			showResults('Invalid Account Number');
			return;
		}
		
		//validate address
		checkAddress=document.getElementById('address').value;
		if (!isValidAddress(checkAddress)) {		
			showResults('Invalid Address');
			return;
		}
		
		//validate seed
		var seed=document.getElementById('seed').value.split(" ");
		if ((seed.length%3!=0)||(seed.length>24)||seed.length==0) {
			showResults('Invalid Seed Length');
			return;
		}
		seed=seed.join(" ");
		
		//get each apps hdkeys
		appTests=[];
		for (testData of appTestsConfig) {
			bip39.rebuild(testData.master);
			for (var di=0;di<2;di++) {
				var test=JSON.parse(JSON.stringify(testData));		//copy data
				test.type=(di==0)?"input":"change";
				test.derivation+='/'+account+"'/"+di;
				var hdkey=bip39.getHDKey(seed);
				test.hd=hdkey.derivePath(test.derivation);
				appTests.push(test);
			}
		}
		
		//start the search
		run=true;
	},10);
});