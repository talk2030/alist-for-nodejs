const { exec } = require('child_process');
const fs = require('fs');

// 寻找当前目录下的 tar.gz 文件
const tarFile = fs.readdirSync(process.cwd()).find(file => file.endsWith('.tar.gz'));

if (!tarFile) {
    console.error('未找到 tar.gz 文件');
    process.exit(1);
}

// 解压文件
exec(`tar -zxvf ${tarFile}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`解压文件时出错： ${err}`);
        return;
    }
    console.log(`解压文件成功：${stdout}`);
    
    // 授予执行权限
    exec('chmod +x alist', (err, stdout, stderr) => {
        if (err) {
            console.error(`授予权限时出错： ${err}`);
            return;
        }
        console.log(`授予权限成功：${stdout}`);

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
