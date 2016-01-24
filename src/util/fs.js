'use strict';

import fs from 'fs';

export function readdir(path){
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if(err){
                reject(err);
            }else{
                resolve(files);
            }
        })
    });
}

export function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
}