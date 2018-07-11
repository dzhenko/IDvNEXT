// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

fetch('https://localhost:44335/api/GetQueriesCount').then(r => {
    if (r && r.text){
        r.text().then(res => document.getElementById('main_totalqueries').textContent = res);
    }
});

fetch('https://localhost:44335/api/GetResolvedAliasesCount').then(r => {
    if (r && r.text){
        r.text().then(res => document.getElementById('main_resolvedAliases').textContent = res);
    }
});

fetch('https://localhost:44335/api/GetQueriesCount').then(r => {
    if (r && r.text){
        r.text().then(res => document.getElementById('test_totalqueries').textContent = res);
    }
});

fetch('https://localhost:44335/api/GetResolvedAliasesCount').then(r => {
    if (r && r.text){
        r.text().then(res => document.getElementById('test_resolvedAliases').textContent = res);
    }
});