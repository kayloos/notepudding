class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.belongs_to :user
      t.json :pages_dump
      t.timestamps
    end
  end
end
