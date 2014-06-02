RSpec::Matchers.define :be_a_user_hash do
  match do |actual|
    actual.keys.sort == %w( config email pages )
  end
end
