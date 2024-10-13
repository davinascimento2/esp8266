# Controle de acesso utilizando NodeMCU, RFID, MQTT e Banco de Dados MySQL

![img](https://raw.githubusercontent.com/douglaszuqueto/esp8266-rfid-banco-de-dados/master/files/images/rfid.png)

## Introdução
Este projeto foi utilizado como base para meu TCC, onde explorei o reconhecimento de tags RFID e aprendi sobre APIs e envio de dados. O objetivo principal é autenticar e autorizar usuários com base em tags RFID, através de uma **SIMPLES** integração com um Banco de Dados.

O projeto atende a uma demanda que já havia identificado e, em um dia, notei pelo menos três pessoas buscando informações sobre esse tema.

Então, que comecem os jogos! Espero que gostem :)

## Materiais utilizados

- NodeMCU
- RFID: Rfid Mfrc522 Mifare
- Jumpers
- Tags RFID
- Buzzer
- Protoboard

## Tecnologias utilizadas (bibliotecas, frameworks)

- **Firmware NodeMCU**
    - [rfid](https://github.com/miguelbalboa/rfid/)
    - [pubsubclient](https://github.com/knolleary/pubsubclient)
- **Back-end Node.js**
    - [mqttjs](https://github.com/mqttjs/MQTT.js)
    - [promise](https://github.com/then/promise)
    - [request-promise](https://github.com/request/request-promise)
    - [express](https://github.com/expressjs/express)
    - [mysqljs](https://github.com/mysqljs/mysql)
    - [dotenv](https://github.com/motdotla/dotenv)
- **Back-end Python**
    - [flask](https://github.com/pallets/flask)
- **Front-end**
    - [bulma](https://github.com/jgthms/bulma)
    - [axios](https://github.com/mzabriskie/axios)
    - [mqttws31](https://github.com/eclipse/paho.mqtt.javascript)

## Fluxo do projeto

![img](https://raw.githubusercontent.com/douglaszuqueto/esp8266-rfid-banco-de-dados/master/files/images/rfid.png)

No diagrama acima, você pode observar o fluxo da aplicação desenvolvida. Pode parecer complicado, mas com o entendimento sobre comunicação de redes, você compreenderá essa arquitetura com facilidade.

Basicamente, temos dois fluxos neste projeto: **ping** e **pong**. Ambos serão abordados a seguir.

### Ping

O fluxo referente ao **PING** é a comunicação inicial. É a partir dele que toda a comunicação começa. Veja a imagem abaixo:

![img](https://raw.githubusercontent.com/douglaszuqueto/esp8266-rfid-banco-de-dados/master/files/images/rfid-ping.png)

As etapas a seguir serão realizadas:

1. Leitura do ID da tag RFID
2. Preparação da payload (mensagem) para envio
3. Envio da payload através do **protocolo MQTT**
4. O serviço do back-end estará escutando o tópico correspondente
5. Após receber a payload (basicamente o ID da tag), será feita uma consulta no banco de dados
6. Após consultar a tag, será feita uma verificação condicional para saber se ela está **ativada** ou **desativada**

... segue no próximo tópico

### Pong

O **PONG** será responsável pelo retorno, ou seja, se a tag lida está ativa/bloqueada ou simplesmente não existe. O resultado será um simples retorno booleano - **0 ou 1**. Veja como ficou o fluxo na imagem abaixo:

![img](https://raw.githubusercontent.com/douglaszuqueto/esp8266-rfid-banco-de-dados/master/files/images/rfid-pong.png)

Continuando com o fluxo da aplicação, seguiremos a partir do **5º passo** abordado anteriormente.

6. Com o retorno (resposta da leitura) em mãos, a mensagem (0 ou 1) será publicada no tópico correspondente
7. O dispositivo embarcado, por sua vez, estará assinando o tópico. Assim, a mensagem será recebida e tratada no **callback**
8. Neste passo, fica a critério de vocês implementar a ação/feedback que será tomado. Eu apenas exibi no monitor serial o status do retorno. Algumas ações/feedbacks que podem ser implementados:
    - **Feedbacks**
        - Ligar um LED (vermelho/verde) conforme o status recebido
        - Exibir uma mensagem, como o nome da pessoa autenticada, em um display
    - **Ações**
        - Abrir uma porta
        - Acionar um relé e realizar alguma ação
        
## Como utilizar o projeto

1. Não possui conta no GitHub? Crie já a sua e comece a compartilhar seus projetos :) (opcional)
2. Não deixe de me seguir no GitHub :p (opcional)
3. Gostou do projeto? Deixe seu **Star**!
4. Clone o projeto ou faça o download neste [link](https://github.com/douglaszuqueto/esp8266-rfid-banco-de-dados/archive/master.zip).

## Organização do repositório

O repositório está organizado de acordo com as responsabilidades que oferece:

- **client**: front-end da aplicação web
- **database**: script com a estrutura das tabelas do MySQL
- **esp8266**: firmware para o NodeMCU
- **server**: back-end da aplicação, com duas opções:
    - Node.js
    - Python *(em desenvolvimento)*

### Firmware NodeMCU

O firmware está localizado na pasta *esp8266*, abra-o com a IDE do Arduino.

**OBS:** Lembre-se de instalar duas bibliotecas, conforme mencionado no tópico *Tecnologias utilizadas*.

Após abrir o firmware, você precisará ajustar algumas variáveis, como rede Wi-Fi, broker, e tópicos. Fique atento às seguintes variáveis:


**OBS²**: O broker utilizado está implementado em minha VPS para uso pessoal. Você pode utilizá-lo, mas não garanto 100% de estabilidade, pois estou sempre testando algo novo :P. A dica é ter seu próprio broker Mosquitto em casa ou em alguma VPS.

#### Esquemático de ligação - RFID + NodeMCU

![img](https://raw.githubusercontent.com/douglaszuqueto/esp8266-rfid-banco-de-dados/master/files/images/nodemcu-rfid.png)

Com o circuito embarcado pronto, faça o upload para a placa e fique de olho no monitor serial. Se tudo estiver ok, você estará pronto para testar suas tags RFID.

### Aplicação Web

A aplicação web, localizada na pasta **client**, é 100% HTML, portanto, não necessita de configurações extraordinárias para rodar. Você pode até abri-la diretamente no navegador.

Aqui estão algumas dicas para um ambiente de teste/desenvolvimento mais agradável:

- Uso do Caddy Server (o que venho utilizando até o momento)
- Uso do Nginx
- Uso do Apache
- http-server (módulo para Node.js)

Na parte da aplicação web, você precisará realizar apenas duas mudanças: a URL da API e a URL do Broker.

Todas as URLs estão no arquivo **app.js**, localizado em **assets/js/app.js**.

```javascript
const apiPath = 'http://127.0.0.1:3000/api'; // se estiver em localhost, pode deixar assim mesmo.

const mqttConfig = {
    broker: 'broker.iot-br.com', // URL do broker
    topic: '/empresas/douglaszuqueto/catraca/entrada/ping', // tópico ouvinte
    port: 8083 // porta referente ao WebSockets do Broker
};
