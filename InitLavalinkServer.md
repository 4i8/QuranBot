1# install JAVA
```
sudo apt-get install default-jre
```
2# install UFW
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install ufw
```
#3 Install LavaLink
```
mkdir LavaLinkServer
cd LavaLinkServer
wget https://github.com/freyacodes/Lavalink/releases/download/3.7.5/Lavalink.jar
wget https://raw.githubusercontent.com/lavalink-devs/Lavalink/master/LavalinkServer/application.yml.example
mv application.yml.example application.yml

ufw allow 2333
```
#4 Install Nodejs
```
sudo apt-get update
sudo apt-get upgrade
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```
#5 install PM2
```
npm i pm2 -g
```
#6 Finally Run
```
pm2 start java --  -jar ./Lavalink.jar
```
