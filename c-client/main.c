#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "unistd.h"
#include "../../paho/install/include/MQTTClient.h"
#include "statgrab.h"
#include "getopt.h"

#define ADDRESS     "tcp://localhost:1883" //TODO - set this as command line argument
#define CLIENTID    "ExampleClientPub"
#define TOPIC       "mqttdemo/status"

int main(int argc, char* argv[])
{
    MQTTClient client;
    MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
    MQTTClient_message pubmsg = MQTTClient_message_initializer;
    MQTTClient_deliveryToken token;
    int rc;

    MQTTClient_create(&client, ADDRESS, CLIENTID,
        MQTTCLIENT_PERSISTENCE_NONE, NULL);
    conn_opts.keepAliveInterval = 20;
    conn_opts.cleansession = 1;

    //check if connected to broker
    if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
    {
        printf("Failed to connect, return code %d\n", rc);
        exit(-1);
    }
    printf("C Client connecting to %s on port %s \n","localhost","1883");
  
    char message[256]; //to store message

    //get hostname
    char hostname[128]; 
    gethostname(hostname, sizeof hostname); 

    //cpu usage
    sg_cpu_percents *cpu_percent; 
    sg_cpu_stats *cpu_diff_stats;

    //memory usage
    sg_mem_stats *mem_stats;
    long long total, free;
    
    //disk usage
    //sg_fs_stats *fs_stats;
    //size_t fs_size;

    sg_init(1); //initialise statgrab;

    //Main loop
    while (1==1) {
        //get system stats
        cpu_diff_stats = sg_get_cpu_stats_diff(NULL);
        cpu_percent = sg_get_cpu_percents_of(sg_last_diff_cpu_percent, NULL) ;
        mem_stats = sg_get_mem_stats(NULL);
        total = mem_stats->total;
        free = mem_stats->free;

        //create JSON message
        sprintf(message,"{"
        "\"id\":\"%s\","
        "\"hostname\":\"%s-C\","
        "\"cpu\":\"%6.2f\","
        "\"memory\":\"%6.2f\","
        "\"disk\":\"60\""
        "}",
        CLIENTID,hostname, cpu_percent->user,
        100 - (((float)free/(float)total)*100));
        
        //send MQTT message
        pubmsg.payload = message;
        pubmsg.payloadlen = strlen(message);
        pubmsg.qos = 0;
        pubmsg.retained = 0;
        MQTTClient_publishMessage(client, TOPIC, &pubmsg, &token);
        printf("Sending message: %s on topic %s.",message, TOPIC);
        rc = MQTTClient_waitForCompletion(client, token, 10000L);
        printf(" Success\n"); 

        usleep(1000*1000);
    }

    MQTTClient_disconnect(client, 10000);
    MQTTClient_destroy(&client);
    return rc;
}
