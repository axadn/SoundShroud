require 'rails_helper'

RSpec.describe 'tracks controller', type: :request do
    it 'displays all the tracks created by a user' do
        @user = User.create(username: "example", password: "password")
        @track1 = Track.create(title: "A Great Struggle", artist_id: @user.id,
            description: "a short piece", genre: "soundtrack" )
        @track2 = Track.create(title: "Another track", artist_id: @user.id,
            description: "a short piece", genre: "soundtrack" )
            get "/api/users/#{@user.id}/tracks"

        get "/api/users/#{@user.id}/tracks"
        body = JSON.parse(response.body)
        expect(body['tracks'][@track1.id.to_s]).to be_truthy
        expect(body['tracks'][@track2.id.to_s]).to be_truthy
    end
    context 'when deleting' do
        before :each do 
            @user = User.create(username: "example", password: "password")

            @user2 = User.create(username: "example2", password: "password2")

            @track1 = Track.create(title: "A Great Struggle", artist_id: @user.id,
                description: "a short piece", genre: "soundtrack" )

            @track2 = Track.create(title: "Another track", artist_id: @user2.id,
                description: "a short piece", genre: "soundtrack")
            post "/api/session", params: {user: {username: 'example', password: 'password'}}
        end

        it "doesn't destroy the track if not logged in as owner" do 
            delete "/api/tracks/#{@track2.id}"
            expect(response.status).to be(403)
        end
    end


end