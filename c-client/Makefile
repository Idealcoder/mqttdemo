mqttdemo-c: main.c 
	gcc main.c ../../paho/install/lib/libpaho-mqtt3c.so -lstatgrab -o mqttdemo-c
install:
	mkdir ${DESTDIR}/bin
	cp mqttdemo-c ${DESTDIR}/bin/mqttdemo-c
