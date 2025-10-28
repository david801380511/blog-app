export function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ errors: ["id must be a positive integer"] });
  }
  next();
}

// Category validators (moved from deleted categoryValidators.js)
export async function validateCategoryBody(req, res, next) {
  try {
    const name = req.body?.name;
    if (!name || typeof name !== 'string' || String(name).trim().length < 1) {
      return res.status(400).json({ errors: ['name is required and must be a non-empty string'] });
    }
    
    // Check for duplicate name (case-insensitive)
    const prisma = (await import('../config/db.js')).default;
    const existing = await prisma.category.findFirst({
      where: { name: { equals: String(name).trim(), mode: 'insensitive' } },
    });
    if (existing) {
      return res.status(400).json({ errors: ['Category name already exists'] });
    }
    
    req.body.name = String(name).trim();
    next();
  } catch (e) {
    next(e);
  }
}

function validatePostFields(title, content, category_id) {
  const errors = [];
  
  // Title validation
  if (typeof title !== "string") {
    errors.push("title is required and must be a string");
  } else if (title.trim().length < 3) {
    errors.push("title must be at least 3 characters");
  }

  // Content validation
  if (typeof content !== "string") {
    errors.push("content is required and must be a string");
  } else if (content.trim().length < 10) {
    errors.push("content must be at least 10 characters");
  }

  // Category validation
  if (category_id !== undefined) {
    const id = Number(category_id);
    if (!Number.isInteger(id) || id <= 0) {
      errors.push("category_id must be a positive integer");
    }
  }

  return errors;
}

export function validatePostBody(req, res, next) {
  const { title, content, category_id } = req.body ?? {};
  const errors = validatePostFields(title, content, category_id);

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  // Sanitize input
  req.body.title = String(title).trim();
  req.body.content = String(content).trim();
  if (category_id !== undefined) {
    req.body.category_id = Number(category_id);
  }
  
  next();
}

export function validatePostBodyForUpdate(req, res, next) {
  const { title, content, category_id } = req.body ?? {};

  // For updates, at least one field must be present
  if (title === undefined && content === undefined && category_id === undefined) {
    return res.status(400).json({ 
      errors: ["at least one of title, content, or category_id is required"] 
    });
  }

  const errors = validatePostFields(
    title === undefined ? "placeholder" : title,
    content === undefined ? "placeholder content" : content,
    category_id
  );

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  // Sanitize provided fields
  if (title !== undefined) req.body.title = String(title).trim();
  if (content !== undefined) req.body.content = String(content).trim();
  if (category_id !== undefined) req.body.category_id = Number(category_id);

  next();
}
