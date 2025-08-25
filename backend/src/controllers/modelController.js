const supabase = require('../config/supabase');

const modelController = {
  async getAll(req, res) {
    try {
      const { setor_id } = req.user;
      
      const { data, error } = await supabase
        .from('modelos')
        .select('*')
        .eq('setor_id', setor_id);
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async create(req, res) {
    try {
      const { nome, tipo_documento, conteudo_html } = req.body;
      const { setor_id } = req.user;
      
      // Inserir novo modelo
      const { data, error } = await supabase
        .from('modelos')
        .insert([{
          nome,
          tipo_documento,
          conteudo_html,
          setor_id
        }])
        .select();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, tipo_documento, conteudo_html } = req.body;
      const { setor_id } = req.user;
      
      // Atualizar modelo
      const { data, error } = await supabase
        .from('modelos')
        .update({
          nome,
          tipo_documento,
          conteudo_html
        })
        .eq('id', id)
        .eq('setor_id', setor_id)
        .select();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      if (data.length === 0) {
        return res.status(404).json({ error: 'Modelo não encontrado' });
      }
      
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { setor_id } = req.user;
      
      // Verificar se o modelo existe e pertence ao setor do usuário
      const { data: existingModel, error: checkError } = await supabase
        .from('modelos')
        .select('id')
        .eq('id', id)
        .eq('setor_id', setor_id)
        .single();
      
      if (checkError || !existingModel) {
        return res.status(404).json({ error: 'Modelo não encontrado' });
      }
      
      // Excluir modelo
      const { error } = await supabase
        .from('modelos')
        .delete()
        .eq('id', id)
        .eq('setor_id', setor_id);
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = modelController;