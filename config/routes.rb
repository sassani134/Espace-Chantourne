Rails.application.routes.draw do
  # static pages
  get "about", to: "static_pages#about"
  get "contact", to: "static_pages#contact"
  get "privacy", to: "static_pages#privacy_policy"
  get "legal", to: "static_pages#legal_information"
  get "terms", to: "static_pages#terms_and_condition"
  # get "cookie", to: "static_pages#cookie_policy"
  get "coming_soon", to: "static_pages#coming_soon"

  get "landing/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "landing#index"
end
