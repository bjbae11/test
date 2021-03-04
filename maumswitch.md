# 네이버 클라우드 maumswitch 

## 접속 정보
* hostname: maum-switch-01
* IP: 221.168.32.165
* Domain name: callbot.maum.ai
* User account: root
* Password: D9cD!qc8U@qt

## 도커 컨테이터 
위의 정보로 접속해서 `docker ps -a`로 확인하면 아래와 같이 두 가지 도커 container가 있으며
* maum-switch-0.0.5는 SIP 전화 콜 처리를 담당하고 STT, TTS와 연동
* python-flask는 웹서버로 client와 연동하여 TTS, STT 기반의 대화를 web 브라우저 화면에 출력할 수 있도록 구현  
```bash
[root@maum-switch-01 ~]# docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                    NAMES
8248b6729096        python:3.7          "python3"           3 weeks ago         Up 9 days           0.0.0.0:5000->5000/tcp   python-flask
5336c3dfded9        cebe576aa53c        "bash"              5 weeks ago         Up 2 weeks                                   maum-switch-0.0.5
```
## maum-switch 도커 컨테이너 
maum-switch 도커 진입은 아래의 명령어를 실행
```bash
docker exec -it maum-switch-0.0.5 bash
```

기본 작업 경로는 `/srv/maum`이며 다음의 경로에서 개발을 진행한다. 샘플 코드는 `/srv/maum/aicc-dev`경로에 있는 python 개인 작업경로에 복사해서 사용한다.
개발/테스트 시에 필요한 python package를 설치하는 경우 내용을 공유한다. 
* 김호섭 매니저: `/srv/maum/aicc-dev/khs`
* 최명주 매니저: `/srv/maum/aicc-dev/mj`
* 배병준 매니저: `/srv/maum/aicc-dev/bbj`

할당된 전화번호는 아래의 경로 `00_inbound_did.xml`파일에서 확인 가능
```bash
cd /usr/local/freeswitch/conf/dialplan/public
```
```xml
  <extension name="public_did">
    <condition field="destination_number" expression="^(07074145483)$">
      <action application="set_profile_var" data="code=mj-app"/>
      <action application="park"/>
    </condition>
  </extension>
  <extension name="public_did">
    <condition field="destination_number" expression="^(07074145484)$">
      <action application="set_profile_var" data="code=khs-app"/>
      <action application="park"/>
    </condition>
  </extension>
  <extension name="public_did">
    <condition field="destination_number" expression="^(07074145485)$">
      <action application="set_profile_var" data="code=bbj-app"/>
      <action application="park"/>
    </condition>
  </extension>
```

## python-flask 도커 
python-flask 도커 진입은 아래의 명령어를 실행
```bash
docker exec -it python-flask bash
```
기본 작업 경로는 `/repo`인데 기존 코드를 사용하지 않는 경우 새로 경로 만들어서 개발을 진행한다. 
* `index.py`: flask 기반 웹서버 코드와 socket.io 서버 코드 
* `static/custom.js`: socket.io 서버와 연동하는 client code
* `static/style.css`: 웹 페이지 CSS 파일
* `template/index.html`: 웹 페이지 HTML 파일 

## maum-switch ESL 기반 python script
* ESL 관련 내용은 Freeswitch의 관련 링크[Freeswitch ESL](https://freeswitch.org/confluence/display/FREESWITCH/Event+List)를 참고
* caller(발신자), called(수신자)의 정보는 아래 헤더 정보를 사용해서 개발하도록 합시다.
    - `Caller-Username: 5723`
    - `Caller-Destination-Number: 5552000`
* 아래는 STT 결과 ESL 이벤트 내용 

```
Event-Subclass: brain_stt::transcription
Event-Name: CUSTOM
Core-UUID: 178dd36c-4e9b-4302-9e87-92889330d2d7
FreeSWITCH-Hostname: localhost
FreeSWITCH-Switchname: localhost
FreeSWITCH-IPv4: 192.168.1.11
FreeSWITCH-IPv6: ::1
Event-Date-Local: 2021-01-18 19:33:09
Event-Date-GMT: Mon, 18 Jan 2021 10:33:09 GMT
Event-Date-Timestamp: 1610965989915379
Event-Calling-File: mod_brain_stt.c
Event-Calling-Function: responseHandler
Event-Calling-Line-Number: 25
Event-Sequence: 1247
Channel-State: CS_EXECUTE
Channel-Call-State: ACTIVE
Channel-State-Number: 4
Channel-Name: sofia/external/5723@221.168.32.165
Unique-ID: 8505b93e-009e-47e8-be46-1ed665efdb0d
Call-Direction: inbound
Presence-Call-Direction: inbound
Channel-HIT-Dialplan: true
Channel-Call-UUID: 8505b93e-009e-47e8-be46-1ed665efdb0d
Answer-State: answered
Channel-Read-Codec-Name: opus
Channel-Read-Codec-Rate: 48000
Channel-Read-Codec-Bit-Rate: 0
Channel-Write-Codec-Name: opus
Channel-Write-Codec-Rate: 48000
Channel-Write-Codec-Bit-Rate: 0
Caller-Direction: inbound
Caller-Logical-Direction: inbound
Caller-Username: 5723
Caller-Dialplan: XML
Caller-Caller-ID-Name: 5723
Caller-Caller-ID-Number: 5723
Caller-Orig-Caller-ID-Name: 5723
Caller-Orig-Caller-ID-Number: 5723
Caller-Network-Addr: 125.132.250.204
Caller-ANI: 5723
Caller-Destination-Number: 5552000
Caller-Unique-ID: 8505b93e-009e-47e8-be46-1ed665efdb0d
Caller-Source: mod_sofia
Caller-Context: public
Caller-Channel-Name: sofia/external/5723@221.168.32.165
Caller-Profile-Index: 1
Caller-Profile-Created-Time: 1610965981315393
Caller-Channel-Created-Time: 1610965981315393
Caller-Channel-Answered-Time: 1610965981435429
Caller-Channel-Progress-Time: 0
Caller-Channel-Progress-Media-Time: 1610965981435429
Caller-Channel-Hangup-Time: 0
Caller-Channel-Transfer-Time: 0
Caller-Channel-Resurrect-Time: 0
Caller-Channel-Bridged-Time: 0
Caller-Channel-Last-Hold: 0
Caller-Channel-Hold-Accum: 0
Caller-Screen-Bit: true
Caller-Privacy-Hide-Name: false
Caller-Privacy-Hide-Number: false
variable_direction: inbound
variable_uuid: 8505b93e-009e-47e8-be46-1ed665efdb0d
variable_session_id: 3
variable_sip_from_params: transport=UDP
variable_sip_from_user: 5723
variable_sip_from_uri: 5723@221.168.32.165
variable_sip_from_host: 221.168.32.165
variable_video_media_flow: disabled
variable_text_media_flow: disabled
variable_channel_name: sofia/external/5723@221.168.32.165
variable_sip_local_network_addr: 221.168.32.165
variable_sip_network_ip: 125.132.250.204
variable_sip_network_port: 43307
variable_sip_invite_stamp: 1610965981315393
variable_sip_received_ip: 125.132.250.204
variable_sip_received_port: 43307
variable_sip_via_protocol: udp
variable_sip_from_user_stripped: 5723
variable_sofia_profile_name: external
variable_sofia_profile_url: sip:mod_sofia@221.168.32.165:5060
variable_recovery_profile_name: external
variable_sip_allow: INVITE, ACK, CANCEL, BYE, NOTIFY, REFER, MESSAGE, OPTIONS, INFO, SUBSCRIBE
variable_sip_req_params: transport=UDP
variable_sip_req_user: 5552000
variable_sip_req_uri: 5552000@221.168.32.165
variable_sip_req_host: 221.168.32.165
variable_sip_to_user: 5552000
variable_sip_to_uri: 5552000@221.168.32.165
variable_sip_to_host: 221.168.32.165
variable_sip_contact_params: transport=UDP
variable_sip_contact_user: 5723
variable_sip_contact_port: 43307
variable_sip_contact_uri: 5723@125.132.250.204:43307
variable_sip_contact_host: 125.132.250.204
variable_sip_user_agent: Z 5.4.10 rv2.10.12.2
variable_sip_via_host: 10.122.65.239
variable_sip_via_port: 43307
variable_sip_via_rport: 43307
variable_max_forwards: 70
variable_switch_r_sdp: v=0
o=Z 1610965981256 1 IN IP4 125.132.250.204
s=Z
c=IN IP4 125.132.250.204
t=0 0
m=audio 8000 RTP/AVP 106 9 98 101 0 8 3
a=rtpmap:106 opus/48000/2
a=fmtp:106 sprop-maxcapturerate=16000; minptime=20; useinbandfec=1
a=rtpmap:98 telephone-event/48000
a=fmtp:98 0-16
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-16

variable_ep_codec_string: mod_opus.opus@48000h@20i@2c,mod_spandsp.G722@8000h@20i@64000b,CORE_PCM_MODULE.PCMU@8000h@20i@64000b,CORE_PCM_MODULE.PCMA@8000h@20i@64000b
variable_DP_MATCH: ARRAY::5552000|:5552000
variable_call_uuid: 8505b93e-009e-47e8-be46-1ed665efdb0d
variable_outside_call: true
variable_RFC2822_DATE: Mon, 18 Jan 2021 19:33:01 +0900
variable_export_vars: RFC2822_DATE
variable_domain_name: 221.168.32.165
variable_rtp_use_codec_string: PCMU,PCMA,OPUS,G722,H264,VP8
variable_remote_video_media_flow: inactive
variable_remote_text_media_flow: inactive
variable_remote_audio_media_flow: sendrecv
variable_audio_media_flow: sendrecv
variable_rtp_audio_recv_pt: 106
variable_rtp_use_codec_name: opus
variable_rtp_use_codec_fmtp: sprop-maxcapturerate=16000; minptime=20; useinbandfec=1
variable_rtp_use_codec_rate: 48000
variable_rtp_use_codec_ptime: 20
variable_rtp_use_codec_channels: 1
variable_rtp_last_audio_codec_string: opus@48000h@20i@1c
variable_read_codec: opus
variable_original_read_codec: opus
variable_read_rate: 48000
variable_original_read_rate: 48000
variable_write_codec: opus
variable_write_rate: 48000
variable_dtmf_type: rfc2833
variable_local_media_ip: 192.168.1.11
variable_local_media_port: 30302
variable_advertised_media_ip: 221.168.32.165
variable_rtp_use_timer_name: soft
variable_rtp_use_pt: 106
variable_rtp_use_ssrc: 1544149781
variable_rtp_2833_send_payload: 98
variable_rtp_2833_recv_payload: 98
variable_remote_media_ip: 125.132.250.204
variable_remote_media_port: 8000
variable_rtp_local_sdp_str: v=0
o=FreeSWITCH 1610935679 1610935680 IN IP4 221.168.32.165
s=FreeSWITCH
c=IN IP4 221.168.32.165
t=0 0
m=audio 30302 RTP/AVP 106 98
a=rtpmap:106 opus/48000/2
a=fmtp:106 useinbandfec=1; minptime=20
a=rtpmap:98 telephone-event/48000
a=fmtp:98 0-16
a=ptime:20
a=sendrecv

variable_endpoint_disposition: ANSWER
variable_sip_to_tag: gt4ZreBXKQgtQ
variable_sip_from_tag: cc1dd31a
variable_sip_cseq: 1
variable_sip_call_id: m1kP-TTIbqoFpmmN1vcx_w..
variable_sip_full_via: SIP/2.0/UDP 10.122.65.239:43307;branch=z9hG4bK-524287-1---47187f26b52f3deb;rport=43307;received=125.132.250.204
variable_sip_full_from: <sip:5723@221.168.32.165;transport=UDP>;tag=cc1dd31a
variable_sip_full_to: <sip:5552000@221.168.32.165>;tag=gt4ZreBXKQgtQ
variable_playback_terminators: none
variable_current_application_data: /srv/maum/switch/test00.wav
variable_current_application: playback
transcription-vendor: mindslab
Content-Length: 48
Content-Length: 48

{"text":"\n금요일","start":41120,"end":52480}
```




