var express = require('express');
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');


// 랜덤한 12개의 니모닉 코드를 얻음
router.post('/newMnemonic', async(req,res) => {
    let mnemonic;
    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({mnemonic});
    } catch(err) {
        console.log(err);
    }
});

// keystore와 address
router.post('/newWallet', async(req, res) => {
  let password = req.body.password
  let mnemonic = req.body.mnemonic;

  try {
    lightwallet.keystore.createVault(
      {
        password: password, 
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'"
      },
      function (err, ks) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);
          
          let address = (ks.getAddresses()).toString();
          let keystore = ks.serialize();

          res.json({ keystore: keystore, address: address });

          // 생성된 keystore를 json파일로 local에 저장
          // fs.writeFile('wallet.json',keystore,function(err,data){
          //   if(err) {
          //       res.json({code:999,message:"실패"});
          //   } else {
          //       res.json({code:1,message:"성공"});
          //   }
          // });
          //

        });
      }
    );
  } catch (exception) { 
    console.log("NewWallet ==>>>> " + exception);
  }
});



module.exports = router;