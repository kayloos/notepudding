FactoryGirl.define do
  factory :user do
    sequence(:email) {|n| "email#{n}@factory.com" }
    password "foobar"

    after(:create) do |user|
      FactoryGirl.create(:pad, user: user)
    end
  end

  factory :pad do
    pages_dump '{"json": "bob"}'
  end
end
