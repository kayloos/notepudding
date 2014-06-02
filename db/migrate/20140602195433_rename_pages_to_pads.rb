class RenamePagesToPads < ActiveRecord::Migration
  def change
    rename_table :pages, :pads
  end
end
