
const MAX_TITLE_LENGTH = 30
const MIN_DESCRIPTION_LENGTH = 500

const MAX_NAME_LENGTH = 10
const MAX_COMMENT_LENGTH = 50

const MAX_PRODUCT_NAME_LENGTH = 25
const MAX_PRODUCT_DESCRIPTION_LENGTH = 200

/* === VALIDATION ERRORS   === */
exports.getValidationErrors = function(title, description){
	const validationErrors = []
	
	if(title.length > MAX_TITLE_LENGTH){
		validationErrors.push("The title needs to be at most "+MAX_TITLE_LENGTH+" characters.")
	}
	if(title.length == 0){
		validationErrors.push("You can not upload post with empty title field")
	}
	
	if(description.length == 0){
		validationErrors.push("You can not upload post with empty description field")
	}
	
	if(description.length > MIN_DESCRIPTION_LENGTH){
		validationErrors.push("The description needs to be at most "+MIN_DESCRIPTION_LENGTH+" characters.")
	}
	return validationErrors
}

exports.getValidationProductError = function(productName, productDescription, productPrice){
	const validationErrors = []

	if(productName.length > MAX_NAME_LENGTH){
		validationErrors.push("The product name needs to be at most "+MAX_PRODUCT_NAME_LENGTH+" characters.")
	}

	if(productName.length == 0){
		validationErrors.push("You can not upload product with empty product name field")
	}

	if(productDescription.length > MAX_PRODUCT_DESCRIPTION_LENGTH){
		validationErrors.push("The product description needs to be at most "+MAX_PRODUCT_DESCRIPTION_LENGTH+" characters.")
	}

	if(productDescription.length == 0){
		validationErrors.push("You can not upload product with empty product description field")
	}
	
	if(productPrice.length == 0){
		validationErrors.push("You can not upload product with empty price field")
	}

	return validationErrors
}

exports.getValidationCommentError = function(name, comment){
	const validationErrors = []

	if(name.length > MAX_NAME_LENGTH){
		validationErrors.push("The name needs to be at most "+MAX_NAME_LENGTH+" characters.")
	}

	if(name.length == 0){
		validationErrors.push("You can not upload comment with empty name field")
	}

	if(comment.length > MAX_COMMENT_LENGTH){
		validationErrors.push("The comment needs to be at most "+MAX_COMMENT_LENGTH+" characters.")
	}

	if(comment.length == 0){
		validationErrors.push("You can not upload comment with empty comment field")
	}
	return validationErrors
}