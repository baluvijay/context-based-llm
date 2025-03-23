
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Settings, Save } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { ChatConfig } from '@/types/chat';

const ConfigPanel: React.FC = () => {
  const { config, setConfig } = useChat();
  const [localConfig, setLocalConfig] = useState<ChatConfig>(config);
  const [open, setOpen] = useState(false);
  
  const handleSave = () => {
    setConfig(localConfig);
    setOpen(false);
    // Store in localStorage for persistence
    localStorage.setItem('chatConfig', JSON.stringify(localConfig));
  };
  
  const updateLocalConfig = (key: keyof ChatConfig, value: string | number) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphism">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">API Configuration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiEndpoint" className="font-medium">
              API Endpoint URL
            </Label>
            <Input
              id="apiEndpoint"
              placeholder="https://api.example.com/chat"
              value={localConfig.apiEndpoint}
              onChange={e => updateLocalConfig('apiEndpoint', e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="apiKey" className="font-medium">
              API Key (Optional)
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Your API key"
              value={localConfig.apiKey || ''}
              onChange={e => updateLocalConfig('apiKey', e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="modelName" className="font-medium">
              Model Name (Optional)
            </Label>
            <Input
              id="modelName"
              placeholder="e.g., gpt-4"
              value={localConfig.modelName || ''}
              onChange={e => updateLocalConfig('modelName', e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature" className="font-medium">
                Temperature: {localConfig.temperature || 0.7}
              </Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              defaultValue={[localConfig.temperature || 0.7]}
              onValueChange={value => updateLocalConfig('temperature', value[0])}
              className="py-2"
            />
            <p className="text-sm text-muted-foreground">
              Lower values make responses more deterministic, higher values make them more creative.
            </p>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigPanel;
