// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let isAlias = function(val) { 
  return val && /^.+@(main|test).eth$/.test(val);
}

let translate = function(target) {
  let oldValue = target.value;
  var host = '';
  if(oldValue.endsWith('@main.eth')){
    host = ''; // todo deploy
  } else if (oldValue.endsWith('@test.eth')){
    host = 'https://localhost:44335';
  }

  if (host){
    target.value = 'Translating alias ...';
  }

  fetch(host + '/api/aliastoaddress/' + oldValue).then(r => { 
    if (r && r.text) {
      r.text().then(addr => {
        if (addr){
          target.value = 'Address found!';
          setTimeout(() => target.value = addr, 1000);
        } else {
          target.value = 'Not found!';
          setTimeout(() => target.value = oldValue, 1000);
        }
      });
    } else {
      target.value = 'Not found!';
      setTimeout(() => target.value = oldValue, 1000);
    } 
  });
} 

document.addEventListener('input', function(e){
  var target = e.target || e.srcElement;
  if (isAlias(target.value)){
    translate(target);
  }
});