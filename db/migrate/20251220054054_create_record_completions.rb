class CreateRecordCompletions < ActiveRecord::Migration[8.0]
  def change
    create_table :record_completions do |t|
      t.references :record, null: false, foreign_key: { on_delete: :cascade }
      t.boolean :completed, default: false
      t.date :date, default: Date.today.month
      t.timestamps
    end
  end
end
