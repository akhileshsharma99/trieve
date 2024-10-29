use super::email_operator::send_email;
use crate::data::models::{Invitation, Pool};
use crate::errors::ServiceError;
use actix_web::web;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;

/// Diesel query
#[tracing::instrument(skip(pool))]
pub async fn create_invitation_query(
    email: String,
    organization_id: uuid::Uuid,
    user_role: i32,
    pool: web::Data<Pool>,
) -> Result<Invitation, ServiceError> {
    use crate::data::schema::invitations::dsl::invitations;

    let mut conn = pool.get().await.map_err(|_e| {
        ServiceError::InternalServerError("Failed to get postgres connection".to_string())
    })?;

    let new_invitation = Invitation::from_details(email, organization_id, user_role);

    let inserted_invitation = diesel::insert_into(invitations)
        .values(&new_invitation)
        .get_result(&mut conn)
        .await
        .map_err(|_db_error| ServiceError::BadRequest("Error inserting invitation.".to_string()))?;

    Ok(inserted_invitation)
}

#[tracing::instrument(skip(pool))]
pub async fn get_invitation_by_id_query(
    id: uuid::Uuid,
    pool: web::Data<Pool>,
) -> Result<Invitation, ServiceError> {
    use crate::data::schema::invitations::dsl as invitations_columns;

    let mut conn = pool.get().await.map_err(|_e| {
        ServiceError::InternalServerError("Failed to get postgres connection".to_string())
    })?;

    let invitation = invitations_columns::invitations
        .filter(invitations_columns::id.eq(id))
        .first::<Invitation>(&mut conn)
        .await
        .map_err(|_db_error| ServiceError::BadRequest("Error getting invitation.".to_string()))?;

    Ok(invitation)
}

#[tracing::instrument]
pub async fn send_invitation(
    inv_url: String,
    invitation: Invitation,
    org_name: String,
) -> Result<(), ServiceError> {
    let sg_email_content = format!(
        "You have been invited to join a Trieve organization: <b>{}</b>. <br/>
         Please click on the link below to register. <br/>
         <a href=\"{}\">
         {}</a><br/><br/><br/>Cheers,<br/> The Trieve Team<br/>This email is intended for {}, if this isn't you, please let us know at 
         <a href=\"mailto:humans@trieve.ai\">humans@trieve.ai</a>",
        org_name,
        inv_url,
        inv_url.split('?').collect::<Vec<&str>>().get(0).unwrap_or(&""),
        invitation.email
    );

    send_email(sg_email_content, invitation.email, None)
}

#[tracing::instrument]
pub async fn send_invitation_for_existing_user(
    email: String,
    org_name: String,
) -> Result<(), ServiceError> {
    let sg_email_content = format!(
        "You've been added to a Trieve organization: <b>{}</b>. <br/><br/><br/>Cheers,
        <br/> The Trieve Team<br/>This email is intended for {}, if this isn't you, please let us know at <a href=\"mailto:humans@trieve.ai\">humans@trieve.ai</a>",
        org_name,
        email
    );

    send_email(sg_email_content, email, None)
}

#[tracing::instrument(skip(pool))]
pub async fn set_invitation_used(
    id: uuid::Uuid,
    pool: web::Data<Pool>,
) -> Result<(), ServiceError> {
    use crate::data::schema::invitations::dsl as invitations_columns;

    let mut conn = pool.get().await.map_err(|_e| {
        ServiceError::InternalServerError("Failed to get postgres connection".to_string())
    })?;

    diesel::update(invitations_columns::invitations)
        .filter(invitations_columns::id.eq(id))
        .set(invitations_columns::used.eq(true))
        .execute(&mut conn)
        .await
        .map_err(|_db_error| {
            ServiceError::BadRequest("Error setting invitation as used.".to_string())
        })?;

    Ok(())
}

#[tracing::instrument(skip(pool))]
pub async fn check_inv_valid(
    inv_code: uuid::Uuid,
    email: String,
    organization_id: Option<uuid::Uuid>,
    pool: web::Data<Pool>,
) -> Result<Invitation, ServiceError> {
    let invitation = get_invitation_by_id_query(inv_code, pool.clone())
        .await
        .map_err(|_| {
            ServiceError::InternalServerError("Could not find invitation for user".to_string())
        })?;

    if invitation.email != email {
        return Err(ServiceError::BadRequest(
            "Email does not match invitation".to_string(),
        ));
    }

    if invitation.organization_id != organization_id.unwrap() {
        return Err(ServiceError::BadRequest(
            "Dataset ID does not match invitation".to_string(),
        ));
    }

    if invitation.used {
        return Err(ServiceError::BadRequest(
            "Invitation has already been used".to_string(),
        ));
    }
    set_invitation_used(invitation.id, pool.clone())
        .await
        .map_err(|_| {
            ServiceError::InternalServerError("Could not set invitation as used".to_string())
        })?;

    Ok(invitation)
}

pub async fn get_invitations_for_organization_query(
    organization_id: uuid::Uuid,
    pool: web::Data<Pool>,
) -> Result<Vec<Invitation>, ServiceError> {
    use crate::data::schema::invitations::dsl as invitations_columns;

    let mut conn = pool.get().await.map_err(|_e| {
        ServiceError::InternalServerError("Failed to get postgres connection".to_string())
    })?;

    let invitations = invitations_columns::invitations
        .filter(invitations_columns::organization_id.eq(organization_id))
        .load::<Invitation>(&mut conn)
        .await
        .map_err(|_db_error| ServiceError::BadRequest("Error getting invitations.".to_string()))?;

    Ok(invitations)
}

pub async fn delete_invitation_by_id_query(
    id: uuid::Uuid,
    pool: web::Data<Pool>,
) -> Result<(), ServiceError> {
    use crate::data::schema::invitations::dsl as invitations_columns;

    let mut conn = pool.get().await.map_err(|_e| {
        ServiceError::InternalServerError("Failed to get postgres connection".to_string())
    })?;

    diesel::delete(invitations_columns::invitations.filter(invitations_columns::id.eq(id)))
        .execute(&mut conn)
        .await
        .map_err(|_db_error| ServiceError::BadRequest("Error deleting invitation.".to_string()))?;

    Ok(())
}
