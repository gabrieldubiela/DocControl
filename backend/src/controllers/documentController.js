const supabase = require('../config/supabase');
const generateDocumentService = require('../services/generateDocumentService');
const pdfService = require('../services/pdfService');

const documentController = {
  async getAll(req, res) {
    try {
      const { setor_id } = req.user;
      
      const { data, error } = await supabase
        .from('documentos')
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
      const { titulo, tipo_documento, conteudo_html } = req.body;
      const { setor_id } = req.user;
      
      // Obter o próximo número do documento para este tipo e setor
      const { data: lastDocument, error: lastDocError } = await supabase
        .from('documentos')
        .select('numero_documento')
        .eq('tipo_documento', tipo_documento)
        .eq('setor_id', setor_id)
        .order('numero_documento', { ascending: false })
        .limit(1);
      
      if (lastDocError) {
        return res.status(400).json({ error: lastDocError.message });
      }
      
      const nextNumber = lastDocument && lastDocument.length > 0 
        ? lastDocument[0].numero_documento + 1 
        : 1;
      
      // Inserir novo documento
      const { data, error } = await supabase
        .from('documentos')
        .insert([{
          titulo,
          tipo_documento,
          conteudo_html,
          numero_documento: nextNumber,
          setor_id,
          links_pdf: []
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
  
  async generateContent(req, res) {
    try {
      const { prompt, tipo_documento } = req.body;
      
      const content = await generateDocumentService.generate(prompt, tipo_documento);
      
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async generatePdf(req, res) {
    try {
      const { id } = req.params;
      const { setor_id } = req.user;
      
      // Buscar documento
      const { data: document, error: docError } = await supabase
        .from('documentos')
        .select('*')
        .eq('id', id)
        .eq('setor_id', setor_id)
        .single();
      
      if (docError || !document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      
      // Buscar modelo
      const { data: model, error: modelError } = await supabase
        .from('modelos')
        .select('*')
        .eq('tipo_documento', document.tipo_documento)
        .eq('setor_id', setor_id)
        .single();
      
      if (modelError || !model) {
        return res.status(404).json({ error: 'Modelo não encontrado' });
      }
      
      // Gerar PDF
      const pdfUrl = await pdfService.generatePdf(model.conteudo_html, document.conteudo_html);
      
      // Atualizar documento com a nova URL do PDF
      const updatedLinks = [...document.links_pdf, pdfUrl];
      const { data, error } = await supabase
        .from('documentos')
        .update({ links_pdf: updatedLinks })
        .eq('id', id)
        .select();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.json({ pdfUrl, document: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = documentController;