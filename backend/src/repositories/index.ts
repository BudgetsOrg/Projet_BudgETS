/**
 * Action           Nom Normalisé      Description
 * 
 * Create           create(data)       Insérer une nouvelle entrée.
 * Read (One)       get(id)            Récupérer une entrée unique par son ID.
 * Read (All)       getAll(filters)    Récupérer une liste (avec pagination/filtres).
 * Update           update(id, data)   Modifier une entrée existante.
 * Delete           delete(id)         Supprimer une entrée.
 * Delete/Update    leaveOrDelete()    Pour supprimer ou sortir d'un objectif commun/shared
 * Get(email)       findByEmail()      pour trouver un user par email
 * 
 * 
 */

export * from './user.repository';
export * from './budget.repository';
export * from './objectif.repository';