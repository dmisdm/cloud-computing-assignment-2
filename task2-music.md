# Assignment 3 Proposal

The idea for this project is to extend the application build in assignment 2 into a music streaming service. There isn't much room, nor desire, for true innovation in this space. Because of this, it will be very similar to other applications, which may be unoriginal but also helps with the design of the application; less time will be focussed on the features and more will be focussed on cloud architecture.

## Feature outline

1. Login and registration to supoport authentication
2. Role based access control for authorization (admins and plain old users)
3. Music search page that federates multiple external music APIs
   1. Use **Spotify** as an external API to populate search results
   2. Also use **ytdl** (Youtube search API)
   3. Could also integrate **Soundcloud** API
   4. Be able to like music
   5. Potentially add to a playlist
4. Personal music importer
   1. Upload your own music to our servers, along with song artwork and metadata
   2. It will be processed asynchronously as a long running task (this is where **AWS SQS** and **Lambda** come in)
   3. **Amazon Elastic Transcoder** is a service we could potentially use to assist with this process of ensuring content is in the formats required for playback on other devices.
5. Library page
   1. View the music you've uploaded and liked
6. Player component
   1. Throughout the wole site, a persistent music player will be visible to control the currently playing song.
7. Jukebox/radio mode
   1. Enter a shared room of a currently playing song, a queue, and be able to control them both and expect it to be synced with everyone else in the room.

## System architecture

We'll deploy the backend as an **ECS service** (a cluster, service, and set of tasks), the frontend as a **CloudFront + S3 web** application. **API Gateway** could also be used as the point of entry to the backend if needed.
**AWS AppSync** could be a good service to easily solve #7: real time collaboration. It may easily facilitate the jukebox functionality.
For personal music importing, we can use ephemeral Lambdas to scale this processing; the backend service that receives the request to upload a song could hand the processing off to a Lambda function, and the same backend service in the same request could listen for changes to the database (by receiving a completion event from SQS or CloudWatch), and send a completion response to the user.
To coordinate all of this, including automated deployments, **AWS CloudFormation** and the **CDK** can be utilised, so that we can describe our whole infrastructure using TypeScript.
