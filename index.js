const { exec } = require('child_process');
const fs = require('fs');

// 下载 alist 压缩包
const downloadUrl = 'https://github.com/alist-org/alist/releases/download/v3.29.1/alist-linux-amd64.tar.gz';
const tarFile = 'alist-linux-amd64.tar.gz';

// 使用 curl 下载文件
const curlCommand = `curl -L -o ${tarFile} ${downloadUrl}`;

exec(curlCommand, (err, stdout, stderr) => {
    if (err) {
        console.error(`使用 curl 下载文件时出错： ${err}`);
        return;
    }
    
    console.log(`使用 curl 下载文件成功：${stdout}`);
    
    // 解压文件
    exec(`tar -zxvf ${tarFile}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`解压文件时出错： ${err}`);
            return;
        }
        console.log(`解压文件成功：${stdout}`);
        
        // 删除压缩包
        fs.unlink(tarFile, err => {
            if (err) {
                console.error(`删除压缩包时出错： ${err}`);
                return;
            }
            console.log(`压缩包删除成功`);

            // 授予执行权限
            exec('chmod +x alist', (err, stdout, stderr) => {
                if (err) {
                    console.error(`授予权限时出错： ${err}`);
                    return;
                }
                console.log(`授予权限成功：${stdout}`);

                // 运行 ./alist admin set fb491cdd
                exec('./alist admin set fb491cdd', (err, stdout, stderr) => {
                    if (err) {
                        console.error(`执行 ./alist admin set fb491cdd 时出错： ${err}`);
                        return;
                    }
                    console.log(`./alist admin set fb491cdd 执行成功：${stdout}`);

                    // 运行程序
                    exec('./alist server', (err, stdout, stderr) => {
                        if (err) {
                            console.error(`运行程序时出错： ${err}`);
                            return;
                        }
                        // 程序运行成功，不再输出提示
                    });
                });
            });
        });
    });
});
