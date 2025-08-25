const supabase = require('../config/supabase');

const signatureService = {
  async signDocument(documentId, userId) {
    try {
      // Verificar se o usuário já assinou este documento
      const { data: existingSignature, error: checkError } = await supabase
        .from('assinaturas')
        .select('id')
        .eq('documento_id', documentId)
        .eq('usuario_id', userId)
        .single();
      
      if (existingSignature) {
        throw new Error('Documento já foi assinado por este usuário');
      }
      
      // Criar nova assinatura
      const { data, error } = await supabase
        .from('assinaturas')
        .insert([{
          documento_id: documentId,
          usuario_id: userId,
          data_assinatura: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        throw new Error(`Erro ao criar assinatura: ${error.message}`);
      }
      
      return data[0];
    } catch (error) {
      throw error;
    }
  },
  
  async getDocumentSignatures(documentId) {
    try {
      const { data, error } = await supabase
        .from('assinaturas')
        .select(`
          *,
          usuarios (
            id,
            email
          )
        `)
        .eq('documento_id', documentId)
        .order('data_assinatura', { ascending: false });
      
      if (error) {
        throw new Error(`Erro ao buscar assinaturas: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = signatureService;