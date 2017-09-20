Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    resources :tracks, only: [:create, :destroy, :show]
    resources :users, only: [:create] do
      resources :tracks, only: [:index]
    end
    resource :session, only: [:create, :destroy, :get]

  end
  get '/', to: 'root#show'
  get '/api/tracks/s3/:id', to: 'api/tracks#getS3Url'
end
