# README

SoundShroud is a music sharing application similiar to the popular site SoundCloud.
A live version of the project is hosted at http://SoundShroud-1571052774.us-west-2.elb.amazonaws.com
The backend API is built using Ruby on Rails with a PostgreSQL database.
Amazon web services S3 service is used for additional file storage.
The frontend is built using of React and Redux.

## Features:
* User authentication
* User uploaded content
* Continuous playback of music while navigating
* Time domain waveforms while playing music
* Auto-generated playlists
* Users can comments on tracks
* Full-text-search for tracks by title and description, users by username and display name
* Audio is converted to mp3 for decreased storage need and faster streaming (at the cost of upload processing time)

## Future Features:
* Recommended Artists
* Following
