import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CertificateRecord {
  id: string;
  token_id: number;
  recipient_address: string;
  recipient_name: string;
  program: string;
  issue_date: string;
  certificate_id: string;
  metadata_uri: string;
  metadata_hash: string;
  revoked: boolean;
  created_at: string;
  updated_at: string;
}

export async function saveCertificateToDb(data: Omit<CertificateRecord, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('certificates')
    .insert(data)
    .select()
    .maybeSingle();

  if (error) throw error;
  return result;
}

export async function getCertificateByTokenId(tokenId: number) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('token_id', tokenId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCertificatesByCertId(certId: string) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('certificate_id', certId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCertificatesByAddress(address: string) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('recipient_address', address.toLowerCase())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateCertificateRevocation(tokenId: number, revoked: boolean) {
  const { data, error } = await supabase
    .from('certificates')
    .update({ revoked, updated_at: new Date().toISOString() })
    .eq('token_id', tokenId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAllCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
