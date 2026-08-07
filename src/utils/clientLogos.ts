const CLIENT_LOGO_FILES: Record<string, string> = {
  'afreximbank': 'Afrexim Bank.png',
  'afrexim bank': 'Afrexim Bank.png',
  'africatalyst': 'Africatalyst.png',
  'bfbs': 'BFBS.png',
  'bible society of kenya': 'BSK.png',
  'bsk': 'BSK.png',
  'capa': 'CAPA France.png',
  'capa france': 'CAPA France.png',
  'eib bank': 'EIB Bank.png',
  'european investment bank': 'EIB Bank.png',
  'european union': 'European Union.png',
  'ippf': 'IPPF AR.png',
  'ippf ar': 'IPPF AR.png',
  'ibac': 'Ibac.png',
  'image registrars': 'Image Registrars.png',
  'knowledge empowering youth': 'Knowledge Empowering Youth.png',
  'key': 'Knowledge Empowering Youth.png',
  'michezo africa': 'Michezo Afrika.png',
  'rhnk': 'RHNK.png',
  'sasini plc': 'Sasini PLC.png',
  'sasini2 plc': 'Sasini PLC.png',
  'white beach palace': 'White beach palace.png',
  'eleon inn': 'eleon Inn.png',
  'emerging leaders foundation': 'elf africa.png',
  'elf': 'elf africa.png',
  'elf africa': 'elf africa.png',
};

function normalizeClientName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getClientLogoUrl(name: string): string | null {
  const normalized = normalizeClientName(name);
  const fileName = CLIENT_LOGO_FILES[normalized];
  return fileName ? `/clients_logos/${fileName}` : null;
}
