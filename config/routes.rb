Rails.application.routes.draw do
  namespace :api do
    get 'search/search'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    resources :tracks, only: [:create, :destroy, :show,:update]  do
      resources :comments, only: [:index, :create]
      resources :users, only: [:index]
    end
    resources :users, only: [:create, :show] do
      resources :tracks, only: [:index]
    end
    resource :session, only: [:create, :destroy]

  end
  post '/api/tracks/verify', to: 'api/tracks#verify'
  post 'api/tracks/:id/img/verify', to: 'api/images#track_verify'
  post 'api/users/:id/img/verify', to: 'api/images#user_verify'
  get '/api/tracks/s3/:id', to: 'api/tracks#get_s3_url'
  get '/api/playlists/tracks/:id', to: 'api/playlists#from_track_id'
  get 'api/playlists/random', to: 'api/playlists#random'
  post '/api/tracks/process', to: 'api/tracks#process_track'
  get 'api/tracks/:id/status', to: 'api/tracks#audio_process_status'
  get 'api/search', to: 'api/search#index'
  get '/', to: 'root#show'

end
