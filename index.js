const { exec } = require('child_process');
const https = require('https');
const fs = require('fs');

// 下载 alist 压缩包
const downloadUrl = 'https://objects.githubusercontent.com/github-production-release-asset-2e65be/323965659/320f0f52-d76c-43aa-865e-de00096d5675?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20231127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231127T065746Z&X-Amz-Expires=300&X-Amz-Signature=eeb5b1e38458ffb4b607fecd7563673ed18323c4b4f20b47755364045f15850b&X-Amz-SignedHeaders=host&actor_id=32673109&key_id=0&repo_id=323965659&response-content-disposition=attachment%3B%20filename%3Dalist-linux-amd64.tar.gz&response-content-type=application%2Foctet-stream';
const tarFile = 'alist-linux-amd64.tar.gz';

const file = fs.createWriteStream(tarFile);
const request = https.get(downloadUrl, response => {
    response.pipe(file);
    file.on('finish', () => {
        file.close(() => {
            console.log('下载完成');
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
    });
}).on('error', err => {
    console.error(`下载文件时出错： ${err}`);
});
