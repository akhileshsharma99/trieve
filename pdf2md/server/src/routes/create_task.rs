use crate::{
    errors::{ErrorResponseBody, ServiceError},
    models::{self, CreateFileTaskResponse, FileTask, FileTaskStatus, RedisPool},
};
use actix_web::{post, web, HttpResponse};
use s3::creds::time::OffsetDateTime;

/// Create a new File Task
///
/// This endpoint creates a new task to convert a file to markdown. The task is added to a queue in Redis for processing.
#[utoipa::path(
    post,
    path = "/task/create",
    tag = "Task",
    context_path = "/api",
    request_body(content = models::UploadFileReqPayload, description = "JSON request payload to create a new task", content_type = "application/json"),
    responses(
        (status = 200, description = "JSON response payload containing the created task", body = models::CreateFileTaskResponse),
        (status = 400, description = "Error typically due to deserialization issues", body = ErrorResponseBody),
    ),
    security(
        ("api_key" = [])
    )
)]
#[post("/create")]
async fn create_task(
    req: web::Json<models::UploadFileReqPayload>,
    redis_pool: web::Data<RedisPool>,
    clickhouse_client: web::Data<clickhouse::Client>,
) -> Result<HttpResponse, actix_web::Error> {
    let clickhouse_task = models::FileTaskClickhouse {
        id: uuid::Uuid::new_v4().to_string(),
        pages: 0,
        pages_processed: 0,
        status: "CREATED".to_string(),
        created_at: OffsetDateTime::now_utc(),
    };

    crate::operators::clickhouse::insert_task(clickhouse_task.clone(), &clickhouse_client)
        .await
        .map_err(|err| ServiceError::BadRequest(err.to_string()))?;

    let task = FileTask {
        task_id: clickhouse_task.id.parse().unwrap(),
        upload_file_data: req.into_inner(),
        attempt_number: 0,
    };

    let mut redis_conn = redis_pool
        .get()
        .await
        .map_err(|err| ServiceError::BadRequest(err.to_string()))?;

    let serialized_message: String = serde_json::to_string(&task)
        .map_err(|_| ServiceError::BadRequest("Failed to Serialize FileTask".to_string()))?;

    let pos_in_queue = redis::cmd("lpush")
        .arg("files_to_process")
        .arg(&serialized_message)
        .query_async::<String>(&mut *redis_conn)
        .await
        .map_err(|err| ServiceError::BadRequest(err.to_string()))?;

    Ok(HttpResponse::Ok().json(CreateFileTaskResponse {
        task_id: task.task_id,
        status: FileTaskStatus::Created,
        pos_in_queue,
    }))
}