'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import QRCode from 'react-qr-code';

const fetchDepositAddress = async (): Promise<{ address: string }> => {
  const res = await api.get('/settings/deposit-address');
  return res.data;
};

const fetchLogo = async (): Promise<{ logoUrl: string | null }> => {
  const res = await api.get('/settings/logo');
  return res.data;
};

const fetchHomeUrl = async (): Promise<{ homeUrl: string }> => {
  const res = await api.get('/settings/home-url');
  return res.data;
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [depositAddress, setDepositAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');
  const [homeUrl, setHomeUrl] = useState('');
  const [isEditingHomeUrl, setIsEditingHomeUrl] = useState(false);
  const [homeUrlError, setHomeUrlError] = useState('');

  const { data: currentAddress, isLoading } = useQuery({
    queryKey: ['depositAddress'],
    queryFn: fetchDepositAddress,
  });

  const { data: currentLogo, isLoading: logoLoading } = useQuery({
    queryKey: ['platformLogo'],
    queryFn: fetchLogo,
  });

  const { data: currentHomeUrl, isLoading: homeUrlLoading } = useQuery({
    queryKey: ['homeUrl'],
    queryFn: fetchHomeUrl,
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (address: string) => {
      const res = await api.post('/settings/admin/update-deposit-address', { address });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositAddress'] });
      setIsEditing(false);
      setDepositAddress('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update address');
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await api.post('/settings/admin/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLogo'] });
      setLogoFile(null);
      setLogoPreview(null);
      setLogoError('');
    },
    onError: (err: any) => {
      setLogoError(err.response?.data?.message || 'Failed to upload logo');
    },
  });

  const handleEditAddress = () => {
    setDepositAddress(currentAddress?.address || '');
    setIsEditing(true);
    setError('');
  };

  const handleSaveAddress = () => {
    const trimmedAddress = depositAddress.trim();
    
    if (!trimmedAddress) {
      setError('Please enter a valid address');
      return;
    }

    if (!trimmedAddress.startsWith('T')) {
      setError('TRC20 address must start with T');
      return;
    }

    if (trimmedAddress.length !== 34) {
      setError('TRC20 address must be exactly 34 characters long');
      return;
    }

    updateAddressMutation.mutate(trimmedAddress);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentAddress?.address || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address', err);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLogoError('Please select an image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('File size must be less than 2MB');
      return;
    }

    setLogoFile(file);
    setLogoError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadLogo = () => {
    if (!logoFile) {
      setLogoError('Please select a logo file');
      return;
    }

    uploadLogoMutation.mutate(logoFile);
  };

  const updateHomeUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await api.post('/settings/admin/update-home-url', { homeUrl: url });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeUrl'] });
      setIsEditingHomeUrl(false);
      setHomeUrl('');
      setHomeUrlError('');
    },
    onError: (err: any) => {
      setHomeUrlError(err.response?.data?.message || 'Failed to update home URL');
    },
  });

  const handleEditHomeUrl = () => {
    setHomeUrl(currentHomeUrl?.homeUrl || '/');
    setIsEditingHomeUrl(true);
    setHomeUrlError('');
  };

  const handleSaveHomeUrl = () => {
    const trimmedUrl = homeUrl.trim();
    
    if (!trimmedUrl) {
      setHomeUrlError('Please enter a valid URL');
      return;
    }

    // Normalize URL: add https:// if it's an external URL without protocol
    let normalizedUrl = trimmedUrl;
    if (!trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      normalizedUrl = `https://${trimmedUrl}`;
    }

    updateHomeUrlMutation.mutate(normalizedUrl);
  };

  return (
    <main className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure platform-wide settings and deposit addresses
        </p>
      </div>

      {/* Home URL Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-slate-100">
                  Navbar Home Link
                </CardTitle>
                <p className="text-xs text-slate-400 mt-1">
                  Configure where the "Home" link in the navbar redirects to
                </p>
              </div>
            </div>
            {!isEditingHomeUrl && !homeUrlLoading && (
              <Button
                onClick={handleEditHomeUrl}
                size="sm"
                className="h-9 px-4 rounded-lg text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit URL
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {homeUrlLoading && (
            <Skeleton className="h-14 w-full bg-slate-800/50 rounded-lg" />
          )}

          {!homeUrlLoading && !isEditingHomeUrl && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-400 mb-2 block">
                Current Home URL
              </label>
              <div className="group relative">
                <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3.5 font-mono text-sm text-slate-200 break-all transition-all hover:border-slate-700 hover:bg-slate-900/80">
                  {currentHomeUrl?.homeUrl && (currentHomeUrl.homeUrl.startsWith('http://') || currentHomeUrl.homeUrl.startsWith('https://')) ? (
                    <>
                      <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-amber-400/80">{currentHomeUrl.homeUrl}</span>
                      <span className="ml-auto text-xs text-slate-500 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">External</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{currentHomeUrl?.homeUrl || '/'}</span>
                      <span className="ml-auto text-xs text-slate-500 bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">Internal</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {!homeUrlLoading && isEditingHomeUrl && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2.5 block flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Home URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={homeUrl}
                    onChange={(e) => {
                      setHomeUrl(e.target.value);
                      setHomeUrlError('');
                    }}
                    placeholder="/dashboard or www.google.com or https://example.com"
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3.5 pl-11 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono transition-all"
                  />
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                {homeUrlError && (
                  <div className="mt-2.5 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-xs text-red-400 flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {homeUrlError}
                    </p>
                  </div>
                )}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Internal Routes
                    </p>
                    <p className="text-xs text-slate-500 font-mono">/, /dashboard, /page</p>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      External URLs
                    </p>
                    <p className="text-xs text-slate-500 font-mono">www.site.com, https://...</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <Button
                  onClick={handleSaveHomeUrl}
                  disabled={updateHomeUrlMutation.isPending}
                  className="h-10 px-6 rounded-lg text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updateHomeUrlMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save URL
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingHomeUrl(false);
                    setHomeUrl('');
                    setHomeUrlError('');
                  }}
                  disabled={updateHomeUrlMutation.isPending}
                  className="h-10 px-6 rounded-lg text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
              </div>

              {updateHomeUrlMutation.isSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm text-emerald-300 flex items-center gap-2.5">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Home URL updated successfully! Changes will be reflected immediately.</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logo Upload Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-100">
            Platform Logo
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Upload your platform logo (displayed in navbar)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Logo Display */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">
                Current Logo
              </label>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex items-center justify-center min-h-[120px]">
                {logoLoading ? (
                  <Skeleton className="h-16 w-32 bg-slate-800/50" />
                ) : currentLogo?.logoUrl ? (
                  <img 
                    src={`http://localhost:4000${currentLogo.logoUrl}`} 
                    alt="Platform Logo" 
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <p className="text-slate-500 text-sm">No logo uploaded yet</p>
                )}
              </div>
            </div>

            {/* Upload New Logo */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">
                Upload New Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
                id="logo-upload"
              />
              <div className="space-y-3">
                <label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-700 rounded-lg hover:border-sky-500/50 hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-slate-400">Click to select logo</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </label>

                {/* Preview */}
                {logoPreview && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Preview:</p>
                    <div className="flex items-center justify-center min-h-[80px] bg-slate-950/60 rounded-lg p-3">
                      <img src={logoPreview} alt="Logo preview" className="max-h-16 max-w-full object-contain" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {logoFile?.name} ({(logoFile?.size! / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                )}

                {logoError && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {logoError}
                  </p>
                )}

                {/* Upload Button */}
                {logoFile && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUploadLogo}
                      disabled={uploadLogoMutation.isPending}
                      className="h-10 px-6 rounded-lg text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      {uploadLogoMutation.isPending ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                    <Button
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                        setLogoError('');
                      }}
                      disabled={uploadLogoMutation.isPending}
                      className="h-10 px-6 rounded-lg text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {uploadLogoMutation.isSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    <p className="text-sm text-emerald-300 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Logo uploaded successfully!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Address Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-100">
                TRC20 Deposit Wallet Address
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                This address is displayed to all users for making deposits
              </p>
            </div>
            {!isEditing && !isLoading && (
              <Button
                onClick={handleEditAddress}
                size="sm"
                className="h-8 px-4 rounded-full text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30"
              >
                Edit Address
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-slate-800/50 rounded-lg" />
              <div className="flex justify-center">
                <Skeleton className="h-[232px] w-[232px] rounded-2xl bg-slate-800/50" />
              </div>
            </div>
          )}

          {!isLoading && !isEditing && (
            /* Display Mode */
            <div className="space-y-4">
              {/* Current Address Display */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Current Address
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-slate-200 break-all">
                    {currentAddress?.address || 'Not set'}
                  </div>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className="h-10 px-4 rounded-lg text-xs font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              {currentAddress?.address && (
                <div className="flex justify-center pt-4">
                  <div className="rounded-2xl border border-slate-700/60 bg-white p-4">
                    <QRCode
                      value={currentAddress.address}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && isEditing && (
            /* Edit Mode */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  New TRC20 Wallet Address
                </label>
                <input
                  type="text"
                  value={depositAddress}
                  onChange={(e) => {
                    setDepositAddress(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter TRC20 wallet address (starts with T, 34 chars)"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                />
                {error && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  ⚠️ Make sure this is a valid TRC20 (Tron network) address. Incorrect addresses may result in lost funds.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAddress}
                  disabled={updateAddressMutation.isPending}
                  className="h-10 px-6 rounded-lg text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  {updateAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setDepositAddress('');
                    setError('');
                  }}
                  disabled={updateAddressMutation.isPending}
                  className="h-10 px-6 rounded-lg text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700"
                >
                  Cancel
                </Button>
              </div>

              {updateAddressMutation.isSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <p className="text-sm text-emerald-300 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Address updated successfully!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-amber-300 text-sm mb-1">Important Security Notice</p>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Always verify the wallet address before saving. Incorrect addresses may result in permanent loss of user funds. 
              Test with a small deposit first after changing the address.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-100">
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/30">
                1
              </span>
              <p>The deposit address you configure here will be displayed to all users on their deposit pages</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/30">
                2
              </span>
              <p>Users will see this address with a QR code for easy scanning</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/30">
                3
              </span>
              <p>Changes take effect immediately for all users - no code deployment needed</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-300 text-xs font-semibold border border-red-500/30">
                !
              </span>
              <p className="text-red-300">
                <strong>Warning:</strong> All user deposits will be sent to this address. Double-check before saving!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

