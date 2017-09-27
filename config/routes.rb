Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    resources :tracks, only: [:create, :destroy, :show,:update]  do
      resources :comments, only: [:index, :create]
      resources :users, only: [:index]
    end
    resources :users, only: [:create,:show] do
      resources :tracks, only: [:index]
    end
    resource :session, only: [:create, :destroy]

  end
  post '/api/tracks/verify', to: 'api/tracks#verify'
  get '/api/tracks/s3/:id', to: 'api/tracks#get_s3_url'
  post '/api/tracks/process', to: 'api/tracks#process_track'
  get 'api/tracks/:id/status', to: 'api/tracks#audio_process_status'
  get '/', to: 'root#show'

end
