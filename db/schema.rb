# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_23_000033) do
  create_table "record_completions", force: :cascade do |t|
    t.integer "record_id", null: false
    t.boolean "completed", default: false
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_id"], name: "index_record_completions_on_record_id"
  end

  create_table "records", force: :cascade do |t|
    t.string "name"
    t.integer "order", null: false
    t.date "date", default: "2025-12-01"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date", "order"], name: "index_records_on_date_and_order", unique: true
    t.index ["date"], name: "index_records_on_date"
  end

  add_foreign_key "record_completions", "records", on_delete: :cascade
end
