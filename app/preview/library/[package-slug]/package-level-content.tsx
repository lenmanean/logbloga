'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Eye, 
  FileCode, 
  FileSpreadsheet, 
  FileArchive,
  CheckCircle2,
  Clock,
  DollarSign,
  CreditCard
} from 'lucide-react';
import type { MockPackage, MockPackageLevelContent } from '@/lib/mock-data/preview-library';

interface PackageLevelContentProps {
  package: MockPackage;
}

export function PackageLevelContent({ package: mockPackage }: PackageLevelContentProps) {
  const [selectedLevel, setSelectedLevel] = useState<'level1' | 'level2' | 'level3'>('level1');

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'markdown':
      case 'md':
        return <FileCode className="h-4 w-4" />;
      case 'zip':
        return <FileArchive className="h-4 w-4" />;
      case 'xlsx':
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'docx':
      case 'word':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const ContentItem = ({ content }: { content: MockPackageLevelContent }) => (
    <div className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="mt-0.5 text-muted-foreground">
          {getFileIcon(content.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{content.name || content.file}</p>
          <p className="text-xs text-muted-foreground mt-1">{content.description}</p>
          {content.platform && (
            <Badge variant="outline" className="text-xs mt-2">
              {content.platform}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary" className="text-xs">
          {content.type.toUpperCase()}
        </Badge>
        <Button variant="outline" size="sm" className="h-8" disabled>
          {content.type === 'markdown' || content.type === 'md' ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              View
            </>
          ) : (
            <>
              <Download className="h-3 w-3 mr-1" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Content</CardTitle>
        <CardDescription>
          All levels and content included in this package
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as typeof selectedLevel)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="level1">Level 1</TabsTrigger>
            <TabsTrigger value="level2">Level 2</TabsTrigger>
            <TabsTrigger value="level3">Level 3</TabsTrigger>
          </TabsList>

          {/* Level 1 Content */}
          <TabsContent value="level1" className="space-y-6 mt-6">
            <LevelOverview level={mockPackage.levels.level1} />
            
            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Implementation Plan</h3>
                <ContentItem content={mockPackage.levels.level1.implementationPlan} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Platform Setup Guides</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level1.platformGuides.map((guide, index) => (
                    <ContentItem key={index} content={guide} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Creative Decision Frameworks</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level1.creativeFrameworks.map((framework, index) => (
                    <ContentItem key={index} content={framework} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Templates & Checklists</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level1.templates.map((template, index) => (
                    <ContentItem key={index} content={template} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Level 2 Content */}
          <TabsContent value="level2" className="space-y-6 mt-6">
            <LevelOverview level={mockPackage.levels.level2} />
            
            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Implementation Plan</h3>
                <ContentItem content={mockPackage.levels.level2.implementationPlan} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Platform Setup Guides</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level2.platformGuides.map((guide, index) => (
                    <ContentItem key={index} content={guide} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Creative Decision Frameworks</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level2.creativeFrameworks.map((framework, index) => (
                    <ContentItem key={index} content={framework} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Templates & Checklists</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level2.templates.map((template, index) => (
                    <ContentItem key={index} content={template} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Level 3 Content */}
          <TabsContent value="level3" className="space-y-6 mt-6">
            <LevelOverview level={mockPackage.levels.level3} />
            
            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Implementation Plan</h3>
                <ContentItem content={mockPackage.levels.level3.implementationPlan} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Platform Setup Guides</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level3.platformGuides.map((guide, index) => (
                    <ContentItem key={index} content={guide} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Creative Decision Frameworks</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level3.creativeFrameworks.map((framework, index) => (
                    <ContentItem key={index} content={framework} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Templates & Checklists</h3>
                <div className="space-y-2">
                  {mockPackage.levels.level3.templates.map((template, index) => (
                    <ContentItem key={index} content={template} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function LevelOverview({ level }: { level: MockPackage['levels']['level1'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Time Investment</p>
              <p className="text-sm font-semibold">{level.timeInvestment}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Expected Revenue</p>
              <p className="text-sm font-semibold">{level.expectedProfit}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Platform Costs</p>
              <p className="text-sm font-semibold">{level.platformCosts}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
