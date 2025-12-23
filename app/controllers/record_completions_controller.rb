class RecordCompletionsController < ApplicationController
  def update
      completion = RecordCompletion.find(params[:id])

      if completion.update(completion_params)
        head :ok
      else
        head :unprocessable_entity
      end
  rescue ActiveRecord::RecordNotFound => e
      head :not_found
  end

  private

  def completion_params
    params.expect(record_completion: :completed)
  end
end
