# nbcc Server

```
sudo nano /etc/systemd/system/nbcc-server.service
```

---

```
[Unit]
Description=nbcc server
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=simple
# BELOW SHOULD CHANGE
WorkingDirectory=/home/yumcoder/app/nbcc-server
User=root
Restart=always
# BELOW SHOULD CHANGE
ExecStart=yarn server
LimitNOFILE=500000
LimitNPROC=500000

[Install]
WantedBy=multi-user.target
```

---

```
sudo systemctl start yum-server
sudo systemctl enable yum-server
sudo systemctl daemon-reload
```

# nbcc Dashboard

```
sudo nano /etc/systemd/system/nbcc-dashboard.service
```

---

```
[Unit]
Description=nbcc dashboard
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=simple
# BELOW SHOULD CHANGE
WorkingDirectory=/home/yumcoder/app/nbcc-server
User=root
# BELOW SHOULD CHANGE
#ExecStart=parse-dashboard --config /home/yumcoder/app/nbcc-server/yum-dashboard-config.json  --allowInsecureHTTP
Restart=on-abort

[Install]
WantedBy=multi-user.target
```

---

```
sudo systemctl start nbcc-dashboard
sudo systemctl enable nbcc-dashboard
sudo systemctl daemon-reload
```
